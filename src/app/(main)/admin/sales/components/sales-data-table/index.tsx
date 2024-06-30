"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  aggregateValue: {
    total_big: number;
    total_small: number;
    total_value: number;
  };
}
export default function SalesDataTable<TData, TValue>({
  data,
  columns,
  isLoading,
  aggregateValue,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });
  return (
    <div className="flex flex-col flex-grow flex-1 ">
      <div className="flex items-center justify-between py-4 ">
        <Input
          placeholder="Search number..."
          value={(table.getColumn("number")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("number")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border overflow-auto max-h-[640px]">
        <div className="">
          <Table>
            <TableHeader className="bg-primary ">
              <TableRow>
                <TableHead
                  colSpan={columns.length}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center">
                    <div className="flex items-center gap-[1rem]">

                 
                    <Badge
                      variant={"secondary"}
                      className="bg-green-200 text-green-800"
                    >
                      Big Buy&nbsp;: RM {aggregateValue.total_big.toFixed(2)}
                    </Badge>
                    <Badge
                      variant={"secondary"}
                      className="bg-green-200 text-green-800"
                    >
                      Small Buy&nbsp;: RM{" "}
                      {aggregateValue.total_small.toFixed(2)}
                    </Badge>
                    </div>
                    <Button variant="ghost" className="text-background">
                      Total Big&nbsp;: RM {aggregateValue.total_big.toFixed(2)}
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-center text-background"
                    >
                      Total Small&nbsp;: RM{" "}
                      {aggregateValue.total_small.toFixed(2)}
                    </Button>
                  </div>

                  <Button variant="ghost" className="text-background">
                    Total Sales&nbsp;: RM{" "}
                    {aggregateValue.total_value.toFixed(2)}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>
        <Table className=" ">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
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
                <TableCell colSpan={columns.length} className="h-24 ">
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
                    <TableCell key={cell.id} className="text-center">
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
        </Table>
      </div>
    </div>
  );
}
