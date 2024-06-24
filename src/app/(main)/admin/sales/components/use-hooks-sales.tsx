/** Note ! --->
 * (Func) TargetSales
 *  use-hookes to manage Ticket to gain aggregate value for Big, Small and Total Value
 */
"use client";

import { useState, useEffect } from "react";
import { SalesColumnType } from "./sales-data-table/columns";
import { useToast } from "@/components/ui/use-toast";
import { RetrieveTargetSales } from "@/server-actions";
import { formatDate } from "@/lib/utils";
import PresetSalesData from "./sales-data-table/preset-data";

interface TargetSalesProps {
  category: string | null;
  draw_date: Date | undefined;
}
type TempInstance = {
  number: number;
  gametype: string;
  amount: number;
};
export default function useHooksTargetSales({
  category,
  draw_date,
}: TargetSalesProps) {
  const [data, setData] = useState<SalesColumnType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [temp, setTemp] = useState<TempInstance[]>([]);
  const { toast } = useToast();
  const uniqueAggregateSales = (array: TempInstance[]) => {
    const result: SalesColumnType[] = [];

    array.forEach((item) => {
      const { number, gametype, amount } = item;
      const existingItem = result.find(
        (exist) => Number(exist.number) === item.number
      );
      if (existingItem) {
        result[
          result.findIndex((exist) => Number(exist.number) === item.number)
        ] = {
          number: `${number}`,
          category: category!,
          draw_date: formatDate(draw_date!),
          total_big:
            gametype === "Big"
              ? amount + existingItem.total_big
              : existingItem.total_big,
          total_small:
            gametype === "Small"
              ? amount + existingItem.total_small
              : existingItem.total_small,
          total_value: amount + existingItem.total_value,
        };
      } else {
        result.push({
          number: `${number}`,
          category: category!,
          draw_date: formatDate(draw_date!),
          total_big: gametype === "Big" ? amount : 0,
          total_small: gametype === "Small" ? amount : 0,
          total_value: amount,
        });
      }
    });

    return result;
  };
  const fetchTargetSales = async () => {
    if (!category || !draw_date) return;
    try {
      setIsLoading(true);
      const target_sales = await RetrieveTargetSales(
        category,
        formatDate(draw_date)
      );

      let expand_temp: TempInstance[] = [];
      if (target_sales) {
        target_sales.forEach((item) => {
          for (let num of item.number) {
            expand_temp.push({
              number: num,
              gametype: item.gametype,
              amount: item.amount,
            });
          }
        });

        const listOfAggregateList = uniqueAggregateSales(expand_temp);
        setData(listOfAggregateList);
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
  useEffect(() => {
    fetchTargetSales();
  }, [draw_date, category]);
  return { isLoading, data };
}
