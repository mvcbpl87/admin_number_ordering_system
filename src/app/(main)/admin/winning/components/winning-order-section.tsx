import { Badge } from "@/components/ui/badge";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { cn, formatDate } from "@/lib/utils";
import FetchWinningOrder from "./hooks/fetch-winning-order";
import { Loader2, Terminal } from "lucide-react";
import { useState } from "react";
import { ReduceWinningOrderType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { IconCash, IconCoin, IconPigMoney } from "@tabler/icons-react";

interface WinnerSectionProps {
  category: string | null;
  gametype: string | null;
  draw_date: Date | undefined;
  winning_number: WinningNumbersWPrize[];
  users: UsersWCommission[];
}
export default function WinningOrderSection({
  category,
  gametype,
  draw_date,
  winning_number,
  users,
}: WinnerSectionProps) {
  const {
    isLoading,
    data,
    open,
    currentUser,
    selectCell,
    setOpen,
    handleDeposit,
  } = FetchWinningOrder({
    category,
    gametype,
    draw_date,
    winning_number,
    users,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Winners</CardTitle>
        <CardDescription>
          Manage your winners and set their prizes.
        </CardDescription>
        <div className="flex items-center gap-2">
          {category && <Badge variant={"secondary"}>{category}</Badge>}
          {draw_date && (
            <Badge variant={"secondary"}>
              draw date: {formatDate(draw_date)}
            </Badge>
          )}
          {gametype && (
            <Badge variant={"secondary"}>gametype: {gametype}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="animate-spin h-4 w-4" />
          </div>
        ) : (
          <>
            <WinningOrderByAgentCell data={data} selectCell={selectCell} />
            <WinningOrderSheetModal
              handleDeposit={handleDeposit}
              currentCell={currentUser[0]}
              isOpen={open}
              setOpen={setOpen}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function WinningOrderByAgentCell({
  data,
  selectCell,
}: {
  data: ReduceWinningOrderType[];
  selectCell: (target: string) => void;
}) {
  const [select, setSelect] = useState<string | null>(null);
  return data.map((ele) => (
    <div
      key={ele.id}
      className={cn(
        "flex items-center justify-between border-l-4 rounded px-4 py-3 mb-2 shadow select-none transition-all hover:bg-accent/40 hover:translate-x-1",
        select === ele.id && "border-primary"
      )}
      onClick={() => {
        setSelect(ele.id);
        selectCell(ele.id);
      }}
    >
      <div className="grid">
        <span className="font-normal text-sm">{ele.username}</span>
        <span className="text-sm">{ele.email}</span>
      </div>
      <div className="grid gap-2 w-[200px]">
        <div className="text-xs font-medium">
          Claimed : RM {ele.total_claimed.toFixed(2)} /{" "}
          {ele.total_sales.toFixed(2)}
        </div>
        <Progress
          value={(ele.total_claimed / ele.total_sales) * 100}
          className="h-1"
        />
      </div>
    </div>
  ));
}

interface WinningOrderSheetModalProps {
  currentCell: ReduceWinningOrderType | undefined;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeposit: (
    target: WinningOrdersWCredentials,
    isDeposited: boolean
  ) => void;
}
function WinningOrderSheetModal({
  currentCell,
  isOpen,
  setOpen,
  handleDeposit,
}: WinningOrderSheetModalProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-[860px] ">
        <WinningTable currentUser={currentCell} handleDeposit={handleDeposit} />
      </SheetContent>
    </Sheet>
  );
}

type SaleStatsType = {
  value: number;
  label: string;
  icon: React.ElementType;
};
function WinningTable({
  currentUser,
  handleDeposit,
}: {
  currentUser: ReduceWinningOrderType | undefined;
  handleDeposit: (
    target: WinningOrdersWCredentials,
    isDeposited: boolean
  ) => void;
}) {
  if (!currentUser) return;

  const SaleStats: SaleStatsType[] = [
    {
      value: currentUser.total_sales,
      label: "Total Sales",
      icon: IconCash,
    },
    {
      value: currentUser.total_claimed,
      label: "Total Claimed",
      icon: IconCoin,
    },
    {
      value: currentUser.total_deposited,
      label: "Deposited",
      icon: IconPigMoney,
    },
  ];

  return (
    <div className="relative grid mt-4 space-y-[1rem]">
      <div className="flex items-center gap-2">
        {/* --- Current User Total Claimed vs Total Sales ---- */}
        <div className="grid gap-2 w-[250px] shadow py-3 px-4 rounded border-l-4 border-primary">
          <div className="grid">
            <span>{currentUser.username}</span>
            <span className="text-sm text-muted-foreground">
              {currentUser.email}
            </span>
          </div>
          <div className="text-xs font-medium">
            Claimed : RM {currentUser.total_claimed.toFixed(2)} /{" "}
            {currentUser.total_sales.toFixed(2)}
          </div>
          <Progress
            value={(currentUser.total_claimed / currentUser.total_sales) * 100}
            className="h-1"
          />
        </div>

        {/* --- Current User Total Deposited vs Total Sales ---- */}
        <div className="grid shadow py-3 px-4 gap-2 rounded h-full border-l-4 border-green-500">
          {SaleStats.map((item) => (
            <div
              key={`item-${item.label}`}
              className="flex items-center gap-2 "
            >
              <item.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{item.label}&nbsp;:</span>
              <span className="text-xs font-medium">
                RM{item.value.toFixed(2)}
              </span>
            </div>
          ))}
          <Progress
            value={
              (currentUser.total_deposited / currentUser.total_sales) * 100
            }
            className="h-1"
            innerStyle="bg-green-500"
          />
        </div>
      </div>
      <Alert variant={'warning'}>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Action disabled after order have been claimed. Cannot recover payout after claimed.
        </AlertDescription>
      </Alert>
      <div className="border rounded">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className=" w-[100px]">order id</TableHead>
              <TableHead>number</TableHead>
              <TableHead>contacts</TableHead>
              <TableHead>prize type</TableHead>
              <TableHead className="">prize winning</TableHead>
              <TableHead>hq_status</TableHead>
              <TableHead className="sr-only table-cell">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUser ? (
              currentUser.data.map((data) => (
                <TableRow key={`order-${data.customer_id}`}>
                  <TableCell className="font-medium text-sm">
                    {data.customer_orders?.id.substring(0, 6)}
                  </TableCell>
                  <TableCell>{`${data.number.join(", ")}`}</TableCell>
                  <TableCell>{data.customer_orders?.phone_number}</TableCell>

                  <TableCell>{data.prizes?.prize_type}</TableCell>
                  <TableCell className="font-medium">
                    RM{" "}
                    {data.prizes?.prize_value &&
                      (data.prizes.prize_value * data.number.length).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {data.deposited ? "deposited" : "not deposited"}
                  </TableCell>

                  <TableCell>
                    <ActionDropdown
                      handleDeposit={handleDeposit}
                      data={data}
                      disabled={data.claimed}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ActionDropdown({
  data,
  handleDeposit,
  disabled = false,
}: {
  data: WinningOrdersWCredentials;
  handleDeposit: (
    target: WinningOrdersWCredentials,
    isDeposited: boolean
  ) => void;
  disabled?: boolean;
}) {
  const [isDeposited, setIsDeposited] = useState(false);

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-haspopup="true"
            size="icon"
            variant="ghost"
            disabled={disabled}
          >
            <DotsVerticalIcon className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem className="p-0">
            <AlertDialogTrigger asChild>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="flex py-2 w-full"
                onClick={() => setIsDeposited(true)}
              >
                <span className="text-start w-full">Deposited</span>
              </Button>
            </AlertDialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <AlertDialogTrigger asChild>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="flex py-2 w-full"
                onClick={() => setIsDeposited(false)}
              >
                <span className="text-start w-full">Not deposited</span>
              </Button>
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you wish to continue claim this ticket?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeposit(data, isDeposited)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function UITest() {
  const [select, setSelect] = useState<string | null>(null);
  const test = Array.from({ length: 6 }, (_, i) => ({
    id: `test-item-${i + 1}`,
    username: "username",
    email: "email details",
    total_payout: 1000,
    total_claimed: 250,
  }));
  return test.map((ele) => (
    <div
      key={ele.id}
      className={cn(
        "flex items-center justify-between border-l-4 rounded px-4 py-3 mb-2 shadow select-none transition-all hover:bg-accent/40 hover:translate-x-1",
        select === ele.id && "border-primary"
      )}
      onClick={() => setSelect(ele.id)}
    >
      <div className="grid">
        <span className="font-normal text-sm">{ele.username}</span>
        <span className="text-sm">{ele.email}</span>
      </div>
      <div className="grid gap-2 w-[200px]">
        <div className="text-xs font-medium">
          Claimed : RM {ele.total_claimed.toFixed(2)} /{" "}
          {ele.total_payout.toFixed(2)}
        </div>
        <Progress
          value={(ele.total_claimed / ele.total_payout) * 100}
          className="h-1"
        />
      </div>
    </div>
  ));
}
