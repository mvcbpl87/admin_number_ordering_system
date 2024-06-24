"use client";
import { Badge } from "@/components/ui/badge";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconConfetti } from "@tabler/icons-react";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SalesTableProps extends HTMLAttributes<HTMLDivElement> {
  users: Users[] | [];
  sales: AllSales[] | [];
}

export default function SalesTable({
  className,
  users,
  sales,
}: SalesTableProps) {
  const calculateTotalSales = (user_id: string) => {
    var totalSales = 0;
    const salesByUser = sales.filter((item) => item.user_id === user_id);
    if (salesByUser.length !== 0) {
      totalSales = salesByUser.reduce((accumulator, current) => {
        const { ticket_numbers } = current;
        const { number, category, amount } = ticket_numbers!;
        const pivot = number.length * amount * category.length;
        return (accumulator += pivot);
      }, 0);
    }
    return totalSales;
  };
  return (
    <Card className={cn("xl:col-span-2", className)}>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Sales made by Agents</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span>Recent sales made by agent for this month! </span>
            <IconConfetti size={15} />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" ">Users</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Commision</TableHead>
              <TableHead className="text-right">Total Sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              users
                .filter((user_tier) => user_tier.tier === "1")
                .map((user) => (
                  <Collapsible key={user.id} asChild>
                    <>
                      <CollapsibleTrigger asChild>
                        <TableRow>
                          <TableCell className="w-[70%]">
                            <div className="font-medium">{user.username}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              {user.email}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col items-center justify-center gap-2 ">
                              <span>{user.role}</span>
                              <Badge
                                className="text-xs text-muted-foreground"
                                variant="secondary"
                              >
                                {`Tier-${user.tier}`}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">RM0</TableCell>
                          <TableCell className="text-right">
                            RM{calculateTotalSales(user.id).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </CollapsibleTrigger>
                      <CollapsibleContent asChild>
                        <>
                          {/* <div className="bg-red">
                            <h2 className="mb-2 md:mb-4">Downline</h2>
                          </div> */}
                          {/* <tr aria-expanded={true}  aria-controls = "radix-:r3" className="bg-red-200 border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                              test
                          </tr> */}
                          <DownlineSalesTable
                            parent_id={user.id}
                            users={users}
                            calculateTotalSales={calculateTotalSales}
                          />
                        </>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface DownlineSalesTableProps {
  parent_id: string;
  users: Users[] | [];
  calculateTotalSales: (user_id: string) => number;
}
function DownlineSalesTable({
  parent_id,
  users,
  calculateTotalSales,
}: DownlineSalesTableProps) {
  return (
    <>
      <TableRow className="">
        <TableCell colSpan={4} className=" p-2  ">
          <div className="flex items-center gap-2">
          <ChevronDown size={15}/>
          <h2 className="">Downline</h2>
            </div>
        
        </TableCell>
      </TableRow>
      {users
        .filter((item) => item.refer_to === parent_id)
        .map((user) => (
          <TableRow className=" bg-muted-foreground/10 hover:bg-muted-foreground/10">
            <TableCell className="w-[70%]">
              <div className="font-medium">{user.username}</div>
              <div className="hidden text-sm text-muted-foreground md:inline">
                {user.email}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col items-center justify-center gap-2 ">
                <span>{user.role}</span>
                <Badge
                  className="text-xs text-muted-foreground"
                  variant="secondary"
                >
                  {`Tier-${user.tier}`}
                </Badge>
              </div>
            </TableCell>
            <TableCell className="text-center">RM0</TableCell>
            <TableCell className="text-right">
              RM{calculateTotalSales(user.id).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}
