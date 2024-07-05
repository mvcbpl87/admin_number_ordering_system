import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";

type ReportType = {
  draw_date: string;
  total_big: number;
  total_small: number;
  total_sales: number;
};
export const columns: ColumnDef<ReportType>[] = [
  {
    id: "draw_date",
    accessorKey: "draw_date",
    header: "draw date",
    cell: ({ row }) => {
      return <div className="text-center">{row.original.draw_date}</div>;
    },
  },
  {
    accessorKey: "total_big",
    header: "Big",
    cell: ({ row }) => (
      <div className="text-center ">RM{row.original.total_big.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "total_small",
    header: "Small",
    cell: ({ row }) => (
      <div className="text-center ">
        RM{row.original.total_small.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "total_sales",
    header: "Total sales",
    cell: ({ row }) => (
      <div className="text-center">RM{row.original.total_sales.toFixed(2)}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => (
      <Button size={"icon"} variant={"ghost"}>
        <MoreVertical className="h-4 w-4" />
      </Button>
    ),
  },
];
