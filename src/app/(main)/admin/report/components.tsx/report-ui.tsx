"use client";
import { useState } from "react";
import { CategoryList } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconImage } from "@/components/shared/IconImgTemplate";
import { DatePickerWithRange } from "./date-picker-range";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { DataTableReport } from "./report-data-table/data-table-report";
import { columns } from "./report-data-table/columns";

export default function ReportUI() {
  const currDate = new Date();
  const [currCategory, setCurrCategory] = useState<string>("all");
  const [date, setDate] = useState<DateRange | undefined>({
    from: currDate,
    to: addDays(currDate, 7),
  });

  return (
    <div className="flex flex-col flex-grow space-y-[1rem]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* --- Set Shop Category --- */}
          <Select onValueChange={setCurrCategory} defaultValue={currCategory}>
            <SelectTrigger className="w-[200px] bg-background">
              <SelectValue placeholder="Select shop category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"all"} onClick={() => setCurrCategory("all")}>
                <span className="flex items-center justify-center gap-2 py-2 text-center">
                  All Categories
                </span>
              </SelectItem>
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
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="grid gap-2">
            <CardTitle>Report order</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span>Report for sales made by agent! </span>
            </CardDescription>
            <div></div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTableReport columns={columns} data={[]} isLoading={false} />
        </CardContent>
      </Card>
    </div>
  );
}
