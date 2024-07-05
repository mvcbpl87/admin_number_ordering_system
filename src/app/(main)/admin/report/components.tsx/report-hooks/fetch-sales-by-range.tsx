"use client";

import { useToast } from "@/components/ui/use-toast";
import { RetrieveSalesOnRange } from "@/server-actions";
import { DateRange } from "react-day-picker";
import React from "react";
import { formatDate } from "@/lib/utils";
import { addDays } from "date-fns";
import { FilterGametype, TotalSales } from "./hooks";

type ReportType = {
  draw_date: string;
  total_big: number;
  total_small: number;
  total_sales: number;
};

interface FetchSalesByRangeProps {
  date: DateRange | undefined;
  category: string;
}
export default function FetchSalesByRange({
  date,
  category,
}: FetchSalesByRangeProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [sales, setSales] = React.useState<ReportType[]>([]);
  const { toast } = useToast();

  const dateDiffInDays = (from: Date, to: Date) => {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const utc2 = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  };

  const FilterDateConstructs = (
    maxRange: number,
    date: { from: Date; to: Date }
  ) => {
    const listOfDates = Array.from({ length: maxRange }, (_, i) => {
      return i === 0
        ? `"${formatDate(date.from)}"`
        : `"${formatDate(addDays(date.from, i + 1))}"`;
    }).join(",");

    return `(${listOfDates})`;
  };

  const CheckDrawDate = () => {
    /** Draw date only for wednesday, saturday & sunday */
    const _constant_day_type = [0, 3, 6];
    if (!date?.from || !date?.to) return;
    const { from, to } = date;
    const maxRange = dateDiffInDays(from, to);
    let listOfDates: Date[] = Array.from({ length: maxRange }, (_, i) =>
      i === 0 ? from : addDays(from, i + 1)
    );
    listOfDates = listOfDates.filter((date) =>
      _constant_day_type.includes(date.getDay())
    );
    return listOfDates.map((date) => formatDate(date));
  };

  const ReduceSalesByDrawDates = (data: AllSales[]): ReportType[] => {
    let total_big = 0;
    let total_small = 0;
    let total_sales = 0;

    const dateList = CheckDrawDate();
    if (!dateList) return [];

    return dateList.map((date) => {
      const currSales = data.filter(
        (item) => item.ticket_numbers?.draw_date === date
      );
      total_big = TotalSales(FilterGametype(currSales, "Big"), category);
      total_small = TotalSales(FilterGametype(currSales, "Small"), category);
      total_sales = total_big + total_small;
      return {
        draw_date: date,
        total_big,
        total_small,
        total_sales,
      };
    });
  };

  React.useEffect(() => {
    const fetchRequest = async () => {
      try {
        setIsLoading(true);

        if (!date?.from || !date?.to) return;
        const { from, to } = date;
        const maxRange = dateDiffInDays(from, to);
        const allDrawDates = FilterDateConstructs(maxRange, { from, to });
        const data = await RetrieveSalesOnRange(allDrawDates);

        if (data) {
          const result = ReduceSalesByDrawDates(data);
          setSales(result);
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
    if (date) fetchRequest();
  }, [date, category]);
  return { sales, isLoading };
}
