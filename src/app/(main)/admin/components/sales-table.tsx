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
import { RoleTypeObj } from "@/lib/types";

interface SalesTableProps extends HTMLAttributes<HTMLDivElement> {
  users: UsersWCommission[] | [];
  sales: AllSales[] | [];
  root_comm: RootCommission;
}

export default function SalesTable({
  className,
  users,
  sales,
  root_comm,
}: SalesTableProps) {
  const calculateAllTotalSales = (data: UsersWCommission[]) => {
    let total: number[] = [];

    data.forEach((user) => {
      const eq_commission = (tier: string, value: number) => {
        if (Number(tier) > 1)
          return (
            ((root_comm.percent - user.commission?.percent!) / 100) * value
          );
        return (user.commission?.percent! / 100) * value;
      };
      const salesByUser = sales.filter((item) => item.user_id === user.id);
      const totalEaUser = salesByUser.reduce((accumulator, current) => {
        const { ticket_numbers } = current;
        const { number, category, amount } = ticket_numbers!;

        const pivot = number.length * amount * category.length;
        return (accumulator += pivot);
      }, 0);
      total.push(eq_commission(user.tier, totalEaUser));
    });
    return total.reduce((sum, num) => (sum += num), 0);
  };
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

  const dfs = (data: UsersWCommission[]) => {
    let global: UsersWCommission[][] = [];
    const testTier1 = data.filter((item) => item.tier === "1");
    const hasChild = (parent_id: string) => {
      return data.filter((item) => item.refer_to === parent_id);
    };

    for (let metaTier1 of testTier1) {
      const flat: UsersWCommission[] = [];
      const stack: UsersWCommission[] = [metaTier1];
      while (stack.length > 0) {
        const cur = stack.shift();
        if (cur) {
          flat.push(cur);
          if (hasChild(cur?.id!).length > 0) {
            hasChild(cur?.id!).forEach((item) => stack.unshift(item));
          }
        }
      }
      global.push(flat);
    }
    return global.length !== 0 ? global : [];
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
                <TableCell colSpan={4} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              dfs(users).map((tree_node) => {
                const root_user = tree_node[0];
                return (
                  <Collapsible key={root_user.id} asChild>
                    <>
                      <CollapsibleTrigger
                        asChild
                        className=" data-[state=open]:bg-muted"
                      >
                        <TableRow className="ml-20">
                          <TableCell className="w-[70%]">
                            <div className="font-medium">
                              {root_user.username}
                            </div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              {root_user.email}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col items-center justify-center gap-2 ">
                              <span>{root_user.role}</span>
                              <Badge
                                className="text-xs text-muted-foreground"
                                variant="secondary"
                              >
                                {root_user.role === RoleTypeObj.Admin
                                  ? `none`
                                  : `Tier-${root_user.tier}`}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            RM { calculateAllTotalSales(tree_node).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            RM{calculateTotalSales(root_user.id).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </CollapsibleTrigger>
                      {tree_node.length > 0 && (
                        <CollapsibleContent asChild>
                          <>
                            <DownlineSalesTable
                              users={tree_node.filter(
                                (item) => item.id !== root_user.id
                              )}
                              calculateTotalSales={calculateTotalSales}
                            />
                          </>
                        </CollapsibleContent>
                      )}
                    </>
                  </Collapsible>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface DownlineSalesTableProps {
  users: UsersWCommission[] | [];
  calculateTotalSales: (user_id: string) => number;
}
function DownlineSalesTable({
  users,
  calculateTotalSales,
}: DownlineSalesTableProps) {
  return (
    <>
      <TableRow className="">
        <TableCell colSpan={4} className=" p-2  ">
          <div className="flex items-center gap-2">
            <ChevronDown size={15} />
            <h2 className="">Downline</h2>
          </div>
        </TableCell>
      </TableRow>
      {users.length === 0 ? (
        <TableRow>
          <TableCell colSpan={4} className="p-2 text-center">
            no result
          </TableCell>
        </TableRow>
      ) : (
        users.map((user) => (
          <TableRow key={`dw-${user.id}`}>
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
                  {user.role === RoleTypeObj.Admin
                    ? `none`
                    : `Tier-${user.tier}`}
                </Badge>
              </div>
            </TableCell>
            <TableCell className="text-center">
              RM
              {user.commission
                ? (
                    (calculateTotalSales(user.id) * user.commission?.percent!) /
                    100
                  ).toFixed(2)
                : 0}
            </TableCell>
            <TableCell className="text-right">
              RM{calculateTotalSales(user.id).toFixed(2)}
            </TableCell>
          </TableRow>
        ))
      )}
    </>
  );
}
