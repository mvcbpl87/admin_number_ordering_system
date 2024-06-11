import Image from "next/image";
import { Loader2, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { RetrieveWinningOrders } from "@/server-actions";
import { formatDate } from "@/lib/utils";
const Data = [
  {
    number: 4321,
    gametype: "Big",
    drawDate: "June 5, 2024",
    prizeType: "First",
    prizeValue: 2400,
  },
  {
    number: 8584,
    gametype: "Big",
    drawDate: "June 5, 2024",
    prizeType: "Third",
    prizeValue: 1500,
  },
  {
    number: 6897,
    gametype: "Big",
    drawDate: "June 5, 2024",
    prizeType: "Second",
    prizeValue: 1800,
  },
];

interface WinningTableProps {
  category: string | null;
  gametype: string | null;
  drawDate: Date | undefined;
  winning_number: WinningNumbersWPrize[];
}
export default function WinningTable({
  category,
  gametype,
  drawDate,
  winning_number,
}: WinningTableProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<WinningOrdersWCredentials[]>([]);
  const { toast } = useToast();

  const fetchWinningOrders = async () => {
    if (!category || !gametype || !drawDate) return;
    try {
      setIsLoading(true);
      const winning_orders = await RetrieveWinningOrders(
        winning_number,
        category,
        gametype,
        formatDate(drawDate)
      );

      console.log(winning_orders);
      if (winning_orders) setData(winning_orders);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWinningOrders();
  }, [category, gametype, drawDate, winning_number]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Winners</CardTitle>
        <CardDescription>
          Manage your winners and set their prizes.
        </CardDescription>
        <div className="flex items-center gap-2">
          {category && <Badge variant={"secondary"}>{category}</Badge>}
          {drawDate && (
            <Badge variant={"secondary"}>
              draw date: {formatDate(drawDate)}
            </Badge>
          )}
          {gametype && (
            <Badge variant={"secondary"}>gametype: {gametype}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" w-[100px]">order id</TableHead>
              <TableHead>number</TableHead>
              <TableHead>contacts</TableHead>
              <TableHead>agent</TableHead>
              <TableHead>prize type</TableHead>
              <TableHead className="text-end">prize winning</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 ">
                  <div className=" flex items-center justify-center">
                    <Loader2 className="animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length !== 0 ? (
              data.map((data, index) => (
                <TableRow key={`item-${index + 1}`}>
                  <TableCell className="font-medium text-sm">
                    {data.customer_orders?.id.substring(0, 8)}
                  </TableCell>
                  <TableCell>{`${data.number.join(", ")}`}</TableCell>
                  <TableCell>{data.customer_orders?.phone_number}</TableCell>
                  <TableCell>
                    <div className="grid gap-2 text-xs">
                      <span>{data.customer_orders?.users?.username}</span>
                      <span className="text-sm text-muted-foreground">
                        {data.customer_orders?.users?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{data.prizes?.prize_type}</TableCell>
                  <TableCell className="text-end font-medium">
                    RM {data.prizes?.prize_value && (data.prizes.prize_value * data.number.length).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
