import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "./data-table-toolbar";
import { Loader2 } from "lucide-react";
import { ReportColumnType } from "@/lib/types";
import { FilterGametype } from "../report-hooks/hooks";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  selectCell: (target: ReportColumnType) => void;
}

export function DataTableReport<TData, TValue>({
  columns,
  data,
  isLoading,
  selectCell,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-center"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
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
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() =>
                        selectCell(cell.row.original as ReportColumnType)
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <CustomTableFooter data={data as ReportColumnType[]} />
        </Table>
      </div>
    </div>
  );
}

type TableFooterProps = {
  data: ReportColumnType[];
};
function CustomTableFooter({ data }: TableFooterProps) {
  let TotalBig = 0;
  let TotalSmall = 0;
  let TotalSum = 0;

  const CalculateSum = (gametype: string) => {
    return data.reduce((acc, item) => {
      const pivot = gametype === "Big" ? item.total_big : item.total_small;
      return (acc += pivot);
    }, 0);
  };
  TotalBig = CalculateSum("Big");
  TotalSmall = CalculateSum("Small");
  TotalSum = TotalBig + TotalSmall;
  return (
    <TableFooter>
      <TableRow className=" h-[3.5rem]">
        <TableCell className="text-end ">{null}</TableCell>
        <TableCell className="text-center ">RM{TotalBig.toFixed(2)}</TableCell>
        <TableCell className="text-center">RM{TotalSmall.toFixed(2)}</TableCell>
        <TableCell className="text-center">RM{TotalSum.toFixed(2)}</TableCell>
        <TableCell className="sr-only">action</TableCell>
      </TableRow>
    </TableFooter>
  );
}
