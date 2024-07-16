import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import { RetrieveWinningOrders, UpsertWinningPayout } from "@/server-actions";
import { useState, useEffect, useMemo } from "react";
import { ReduceWinningOrderType } from "@/lib/types";

interface FetchWinningOrderProps {
  category: string | null;
  gametype: string | null;
  draw_date: Date | undefined;
  winning_number: WinningNumbersWPrize[];
  users: UsersWCommission[];
}

export default function FetchWinningOrder({
  category,
  gametype,
  draw_date,
  winning_number,
  users,
}: FetchWinningOrderProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<WinningOrdersWCredentials[]>([]);
  const [currentCell, setCurrentCell] = useState<string>();
  const { toast } = useToast();

  const selectCell = (target: string) => {
    setCurrentCell(target);
    setOpen(!open);
  };

  const handleDeposit = async (
    target: WinningOrdersWCredentials,
    isDeposited: boolean
  ) => {
    try {
      var temp = target;
      temp.deposited = isDeposited;

      const update_data = await UpsertWinningPayout(temp);
      if (update_data) {
        var existingItems = [...orders];
        var ItemIndex = existingItems.findIndex(
          (currItem) =>
            currItem.customer_id === update_data.customer_id &&
            currItem.prize_id === update_data.prize_id
        );
        existingItems[ItemIndex] = update_data;
        setOrders(existingItems);
      }
      toast({
        variant: "successful",
        title: "Success deposit payout",
        description: `Successfully deposit payout for order ${target.customer_orders?.id}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    }
  };

  const WinningOrderReducerByUser = (data: WinningOrdersWCredentials[]) => {
    const calculateTotalPayout = (
      currData: WinningOrdersWCredentials[],
      constraints: string = "none"
    ): number => {
      return currData.reduce((sum, item) => {
        const { number, prizes, claimed, deposited } = item;
        const { prize_value } = prizes!;
        let eq = prize_value * number.length;
        if (constraints === "deposited")
          return !deposited ? (sum += 0) : (sum += eq);
        if (constraints === "claimed")
          return !claimed ? (sum += 0) : (sum += eq);
        return (sum += eq);
      }, 0);
    };

    const temp = users.reduce((acc: ReduceWinningOrderType[], user) => {
      var orders: ReduceWinningOrderType[] = [...acc];
      const meta = data.filter(
        (item) => item.customer_orders?.users?.id === user.id
      );
      const total_sales = calculateTotalPayout(meta);
      const total_deposited = calculateTotalPayout(meta, "deposited");
      const total_claimed = calculateTotalPayout(meta, "claimed");

      orders.push({
        id: user.id,
        username: user.username!,
        email: user.email!,
        total_deposited,
        total_sales,
        total_claimed,
        data: meta,
      });
      return orders;
    }, [] as ReduceWinningOrderType[]);

    return temp;
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!category || !gametype || !draw_date) return;
      try {
        setIsLoading(true);
        const winning_orders = await RetrieveWinningOrders(
          winning_number,
          category,
          gametype,
          formatDate(draw_date)
        );
        if (winning_orders) {
          setOrders(winning_orders);
          // setData(WinningOrderReducerByUser(winning_orders));
        }
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
    fetchData();
  }, [category, gametype, draw_date, winning_number]);

  const data = useMemo(() => WinningOrderReducerByUser(orders), [orders]);
  const currentUser = useMemo(() => {
    return data.filter((item) => item.id === currentCell);
  }, [currentCell, orders]);

  return {
    data,
    isLoading,
    open,
    currentUser,
    selectCell,
    setOpen,
    handleDeposit,
  };
}
