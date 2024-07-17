import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  FilterDrawDateAndUserId,
  GroupingCustomerOrder,
  TotalSales,
} from "./report-hooks/hooks";
import { ChevronLeft, Loader2 } from "lucide-react";
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

interface ReportSheetModalProps {
  isOpen: boolean;
  category: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  users: UsersWCommissionCredits[];
  sales: AllSales[];
  current_draw: string;
}

type OrderDetailsType = {
  total_sales: number;
  draw_date: string;
  category: string;
  data: AllSales[];
};

function GetOrderDetails(
  sales: AllSales[],
  user_id: string,
  draw_date: string,
  category: string
): OrderDetailsType {
  const currentSales = FilterDrawDateAndUserId(sales, user_id, draw_date);
  const total_sales = TotalSales(currentSales, category);
  return {
    total_sales,
    draw_date,
    category,
    data: currentSales,
  };
}
const TicketDetailsTable = ({ sales, category, }: {
    category: string;
    sales: AllSales[];
  }) => {
  const TotalSubValue = (d_category: string, item: TicketNumbers) => {
    const { number, amount, category } = item;
    const EQ = number.length * amount;
    const EQ2 = number.length * amount * category.length;
    return d_category !== "all" || !d_category ? EQ : EQ2;
  };
  const TotalValue = TotalSales(sales, category);
  return (
    <div className={cn("border rounded-lg")}>
      <Table>
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
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            sales.map((order, index) => (
              <TableRow key={`orderDetailsRow-${index + 1}`}>
                <TableCell className="font-medium text-center">
                  {order.id.substring(0, 8)}
                </TableCell>
                <TableCell className=" text-center">
                  {order.ticket_numbers?.number[0]}
                </TableCell>
                <TableCell className="text-center">
                  {!order.ticket_numbers?.boxbet ? "None" : "Box"}
                </TableCell>
                <TableCell className="text-center">
                  {order.ticket_numbers?.gametype}
                </TableCell>
                <TableCell className="text-center">
                  {TotalSubValue(category, order.ticket_numbers!).toFixed(2)}
                </TableCell>
              </TableRow>
            ))
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
};

function CustomerOrderTable({
  sales,
  category,
  viewOrder,
}: {
  sales: AllSales[];
  category: string;
  viewOrder: (receipt_id: string) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const orders = GroupingCustomerOrder(sales);
  const TotalValue = TotalSales(sales, category);

  return (
    <div className="border rounded-lg ">
      <Table>
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
              <TableCell colSpan={5} className="h-24 ">
                <div className=" flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              </TableCell>
            </TableRow>
          ) : orders.length !== 0 ? (
            orders.map((order) => {
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
                  onClick={() => viewOrder(order.receipt_id)}
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

function OrderDetailsView({
  orderDetails,
}: {
  user_id: string;
  orderDetails: OrderDetailsType;
}) {
  const [moreDetails, setMoreDetails] = useState<string | null>(null);
  let total_sales = 0;
  let draw_date = "--";
  let category = "--";
  total_sales = orderDetails.total_sales;
  draw_date = orderDetails.draw_date;
  category = orderDetails.category;

  const viewOrder = (receipt_id: string) => setMoreDetails(receipt_id);

  return (
    <div className="relative space-y-[1rem] overflow-y-auto px-2">
      <div className="flex items-center gap-2 sticky top-0 bg-background z-10 py-2">
        <Badge className="py-1 font-normal" variant={"secondary"}>
          Total Sales: RM&nbsp;{total_sales.toFixed(2)}
        </Badge>
        <Badge className="py-1 font-normal" variant={"secondary"}>
          Draw date: {draw_date}
        </Badge>
        <Badge className="py-1 font-normal" variant={"secondary"}>
          Category: {category}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={!moreDetails ? "outline" : "default"}
          size="icon"
          className={cn("h-7 w-7 opacity-10", moreDetails && "opacity-1")}
          onClick={() => setMoreDetails(null)}
        >
          <ChevronLeft className={"h-4 w-4 "} />
          <span className="sr-only">Back</span>
        </Button>
        <span className="text-sm text-accent-foreground">
          {!moreDetails ? "Order details" : `Order details for ${moreDetails}`}
        </span>
      </div>
      {moreDetails ? (
        <TicketDetailsTable category={category} sales={orderDetails.data} />
      ) : (
        <CustomerOrderTable
          sales={orderDetails.data}
          category={orderDetails.category}
          viewOrder={viewOrder}
        />
      )}
    </div>
  );
}

export default function ReportSheetModal({
  isOpen,
  setOpen,
  users,
  category,
  sales,
  current_draw,
}: ReportSheetModalProps) {

  const _locale_myr = "RM";
  const [currentUser, setCurrentUser] = useState('');

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-[860px]">
        <div className="grid md:grid-cols-[240px,1fr] gap-[1rem] mt-4 h-full ">
          {/* ---- Agent list ---- */}
          <div className="gap-1 flex flex-col border-r pr-4 overflow-auto">
            <div className="mb-2 font-normal">Agent</div>
            {users.map((user) => {
              const meta = GetOrderDetails(
                sales,
                user.id,
                current_draw,
                category
              );
              return (
                <div
                  key={user.id}
                  className={cn(
                    "grid text-sm font-light rounded-lg px-4 py-2 border-l-4 shadow-md mb-2 hover:translate-x-2 transition-all  ",
                    user.id === currentUser && " border-primary translate-x-2"
                  )}
                  onClick={() => setCurrentUser(user.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="grid">
                      <span className="text-start select-none font-semibold">
                        {user.username}
                      </span>
                      <span className="select-none">{user.email}</span>
                    </div>
                    <div>
                      <Badge
                        className="font-light select-none"
                        variant={"secondary"}
                      >
                        {_locale_myr}&nbsp;:&nbsp;
                        {meta.total_sales}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---- Order Details View ---- */}
          <OrderDetailsView
            user_id={currentUser}
            orderDetails={GetOrderDetails(
              sales,
              currentUser,
              current_draw,
              category
            )}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
