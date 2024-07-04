import { ColumnDef } from "@tanstack/react-table";

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
      return <div className="w-[100px]">{row.original.draw_date}</div>;
    },
  },
  {
    accessorKey:'total_big',
    header:'Big',
    cell: ({row}) =>(<div className="text-center w-[300px]">{row.original.total_big}</div>)
  },
  {
    accessorKey:'total_small',
    header:'Small',
    cell: ({row}) =>(<div className="text-center w-[300px]">{row.original.total_small}</div>)
  },
  {
    accessorKey:'total_sales',
    header:'Total sales',
    cell: ({row}) =>(<div className="">{row.original.total_sales}</div>)
  }
];
