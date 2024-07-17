"use client";
import { useState } from "react";
import { CategoryList, ReportColumnType } from "@/lib/types";
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
import { DataTableReport } from "./report-data-table/data-table-report";
import { columns } from "./report-data-table/columns";
import FetchSalesByRange from "./report-hooks/fetch-sales-by-range";
import ReportSheetModal from "./report-sheet-modal";

interface ReportUIProps {
  users: UsersWCommissionCredits[];
}

export default function ReportUI({ users }: ReportUIProps) {
  const [currentCell, setCurrentCell] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const {
    sales,
    salesReport,
    isLoading,
    category,
    setCategory,
    date,
    setDate,
  } = FetchSalesByRange();

  const selectCell = (target: ReportColumnType) => {
    setCurrentCell(target.draw_date);
    setOpen(!open);
  };

  return (
    <div className="flex flex-col flex-grow space-y-[1rem]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* --- Set Shop Category --- */}
          <Select onValueChange={setCategory} defaultValue={category}>
            <SelectTrigger className="w-[200px] bg-background">
              <SelectValue placeholder="Select shop category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"all"} onClick={() => setCategory("all")}>
                <span className="flex items-center justify-center gap-2 py-2 text-center">
                  All Categories
                </span>
              </SelectItem>
              {CategoryList.map((category) => (
                <SelectItem
                  value={category.name}
                  key={category.name}
                  onClick={() => setCategory(category.name)}
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
          </div>
        </CardHeader>
        <CardContent>
          <DataTableReport
            columns={columns}
            selectCell={selectCell}
            data={salesReport}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
      {currentCell && (
        <ReportSheetModal
          isOpen={open}
          setOpen={setOpen}
          users={users}
          category={category}
          sales={sales}
          current_draw={currentCell}
        />
      )}
    </div>
  );
}
