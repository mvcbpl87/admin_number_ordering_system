"use client";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/shared/DatePicker";
import { IconImage } from "@/components/shared/IconImgTemplate";
import { CategoryList } from "@/lib/types";
import SalesDataTable from "./sales-data-table";
import { columns } from "./sales-data-table/columns";
import useHooksTargetSales from "./use-hooks-sales";

export default function SalesInterface() {
  const [currCategory, setCurrCategory] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const { isLoading, data } = useHooksTargetSales({
    category: currCategory,
    draw_date: date,
  });
  const aggregateValue = useMemo(() => {
    return data.reduce(
      (accumulator, current) => {
        const { total_big, total_small, total_value } = current;
        return {
          total_big: accumulator.total_big + total_big,
          total_small: accumulator.total_small + total_small,
          total_value: accumulator.total_value + total_value,
        };
      },
      {
        total_big: 0,
        total_small: 0,
        total_value: 0,
      }
    );
  }, [data]);
  return (
    <div className="flex flex-col flex-grow relative">
      <div className=" flex items-center gap-2">
        {/* --- Set Shop Category --- */}
        <Select
          onValueChange={setCurrCategory}
          defaultValue={!currCategory ? "" : currCategory}
        >
          <SelectTrigger className="w-[200px] bg-background">
            <SelectValue placeholder="Select shop category" />
          </SelectTrigger>
          <SelectContent>
            {CategoryList.map((category) => (
              <SelectItem
                value={category.name}
                key={category.name}
                onClick={() => setCurrCategory(category.name)}
              >
                <div className="flex items-center gap-2 py-2">
                  <IconImage src={category.src} alt={category.alt} />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DatePicker date={date} setDate={setDate} />
      </div>
      <div className="flex flex-col flex-1">
        <SalesDataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          aggregateValue={aggregateValue}
        />
      </div>
    </div>
  );
}
