import { Loader2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { RetrieveWinningOrders, UpsertWinningClaim } from "@/server-actions";
import { formatDate } from "@/lib/utils";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

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
              <TableHead>hq_status</TableHead>
              <TableHead className="text-end">prize winning</TableHead>
              <TableHead className="sr-only table-cell">Action</TableHead>
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
                  <TableCell>
                    {data.claimed ? "received" : "not received"}
                  </TableCell>
                  <TableCell className="text-end font-medium">
                    RM{" "}
                    {data.prizes?.prize_value &&
                      (data.prizes.prize_value * data.number.length).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <ActionDropdown data={data} setData={setData} />
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

function ActionDropdown({
  data,
  setData,
}: {
  data: WinningOrdersWCredentials;
  setData: React.Dispatch<React.SetStateAction<WinningOrdersWCredentials[]>>;
}) {
  const { toast } = useToast();
  const [isDeposited, setIsDeposited] = useState(false);

  const handleClaim = async () => {
    try {
      var temp = data;
      temp.claimed = isDeposited;

      const update_data = await UpsertWinningClaim(temp);
      if (update_data)
        setData((prev) => {
          var exisitingItems = [...prev];
          var ItemIndex = exisitingItems.findIndex(
            (currItem) =>
              currItem.customer_id === update_data[0].customer_id &&
              currItem.prize_id === update_data[0].prize_id
          );
          exisitingItems[ItemIndex] = update_data[0];
          return exisitingItems;
        });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    }
  };
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
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
          <AlertDialogAction onClick={handleClaim}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
