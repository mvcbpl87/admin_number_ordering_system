import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupingCustomerOrder, TotalSales } from "./report-hooks/hooks";
import { IconChevronLeft } from "@tabler/icons-react";

type Props = {
  all_sales: AllSales[];
  category: string;
};
export default function ViewCustomerOrder({
  category,
  all_sales,
}: Props) {
  const [currentReceipt, setCurrentReceipt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const viewOrderDetails = (order_id: string) => {
    setCurrentReceipt(order_id);
  };

  const customerOrder = GroupingCustomerOrder(all_sales);
  const CalculateTotalSales = (
    tickets: TicketNumbers[],
    d_category: string /* default category */
  ) => {
    return tickets.reduce((sum, item) => {
      let pivot = 0;
      const { number, amount, category } = item;
      const EQ = number.length * amount;
      const EQ2 = number.length * amount * category.length;
      pivot = d_category !== "all" || !d_category ? EQ : EQ2;
      return (sum += pivot);
    }, 0);
  };
  const TotalValue = TotalSales(all_sales, category);

  if (currentReceipt) {
    const tickets = customerOrder.filter(
      (order) => order.receipt_id === currentReceipt
    )[0].ticket_numbers;

    const TotalTicketValue = () => {
      return CalculateTotalSales(tickets, category);
    };

    const TotalSubValue = (d_category: string, item: TicketNumbers) => {
      const { number, amount, category } = item;
      const EQ = number.length * amount;
      const EQ2 = number.length * amount * category.length;
      return d_category !== "all" || !d_category ? EQ : EQ2;
    };
    return (
      <div className="space-y-[1rem]">
        <div className="flex items-center gap-2">
          <Button
            size={"icon"}
            onClick={() => setCurrentReceipt(null)}
            className="h-7 w-7"
          >
            <IconChevronLeft size={15} />
          </Button>
          <span className="text-muted-foreground text-sm">
            Receipt {currentReceipt}
          </span>
        </div>

        <Table className="border">
          <TableCaption>A list of number details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">ticket_id</TableHead>
              <TableHead className="text-center">num</TableHead>
              <TableHead className="text-center">boxbet</TableHead>
              <TableHead className="text-center">gametype</TableHead>
              <TableHead className="text-center">amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((order, index) => (
              <TableRow key={`orderDetailsRow-${index + 1}`}>
                <TableCell className="font-medium text-center">
                  {order.id.substring(0, 8)}
                </TableCell>
                <TableCell className=" text-center">
                  {order.number[0]}
                </TableCell>
                <TableCell className="text-center">
                  {!order.boxbet ? "None" : "Box"}
                </TableCell>
                <TableCell className="text-center">{order.gametype}</TableCell>
                <TableCell className="text-center">
                  {TotalSubValue(category, order).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="h-[3.5rem] text-end">
                Total value
              </TableCell>
              <TableCell className="text-center">
                RM{TotalTicketValue().toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
  return (
    <div className="">
      <Table className="border  ">
        <TableCaption>A list of customer orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">receipt</TableHead>
            <TableHead className="text-center">contact</TableHead>
            <TableHead className="text-center">big</TableHead>
            <TableHead className="text-center">small</TableHead>
            <TableHead className="text-center">value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 ">
                <div className=" flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              </TableCell>
            </TableRow>
          ) : customerOrder.length !== 0 ? (
            customerOrder.map((order) => {
              const Reducer = (
                t: TicketNumbers[],
                d_category: string,
                gametype: string
              ) => {
                return t
                  .filter((item) => item.gametype === gametype)
                  .reduce((sum, item) => {
                    let pivot = 0;
                    const { number, amount, category } = item;
                    const EQ = number.length * amount;
                    const EQ2 = number.length * amount * category.length;
                    pivot = d_category !== "all" || !d_category ? EQ : EQ2;
                    return (sum += pivot);
                  }, 0);
              };
              const TotalBig = Reducer(order.ticket_numbers, category, "Big");
              const TotalSmall = Reducer(
                order.ticket_numbers,
                category,
                "Small"
              );
              const TotalSum = TotalBig + TotalSmall;
              return (
                <TableRow
                  key={order.receipt_id}
                  onClick={() => viewOrderDetails(order.receipt_id)}
                >
                  <TableCell className="font-medium text-center">
                    {order.receipt_id}
                  </TableCell>
                  <TableCell className="text-center">
                    {order.phone_number}
                  </TableCell>
                  <TableCell className="text-center">
                    {TotalBig.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {TotalSmall.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {TotalSum.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="h-[3.5rem] text-end">
              Total value
            </TableCell>
            <TableCell className="text-center">
              RM{TotalValue.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
