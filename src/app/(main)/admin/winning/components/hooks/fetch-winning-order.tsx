import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import { RetrieveWinningOrders } from "@/server-actions";
import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<ReduceWinningOrderType[]>([]);
  const { toast } = useToast();

  const WinningOrderReducerByUser = (data: WinningOrdersWCredentials[]) => {
    const calculateTotalPayout = (
      currData: WinningOrdersWCredentials[],
      constraints: string = "none"
    ): number => {
      return currData.reduce((sum, item) => {
        const { prize_value } = item.prizes!;
        if (constraints === "claimed") return !item.claimed ? 0 : prize_value;
        return (sum += prize_value);
      }, 0);
    };
    const temp = users.reduce((acc: ReduceWinningOrderType[], user) => {
      var orders: ReduceWinningOrderType[] = [...acc];
      const meta = data.filter(
        (item) => item.customer_orders?.users?.id === user.id
      );
      const total_payout = calculateTotalPayout(meta);
      const total_claimed = calculateTotalPayout(meta, "claimed");

      orders.push({
        id: user.id,
        username: user.username!,
        email: user.email!,
        total_payout,
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
        if (winning_orders) setData(WinningOrderReducerByUser(winning_orders));
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

  return { data, isLoading };
}
