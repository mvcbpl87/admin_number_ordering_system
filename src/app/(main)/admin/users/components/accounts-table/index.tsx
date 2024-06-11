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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useModal } from "@/components/provider/modal-provider";
import { CustomModal } from "@/components/shared/custom-modal";
// import { CreateSubAccountForm } from "@/components/form/create-subaccount-form";
import { Separator } from "@/components/ui/separator";
import { CreateUserAccountForm } from "@/components/form/create-user-account";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  user_id: string;
  role: string;
  tier: string
}
export default function UsersAccountsDataTable<TData, TValue>({
  columns,
  data,
  user_id,
  role,
  tier
}: DataTableProps<TData, TValue>) {
  const modal = useModal();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const AddNewAccount = () => {
    modal.setOpen(
      <CustomModal
        title="Create new users"
        subheading="Create new agent or admin account. Please provide all credentials below."
      >
        <Separator className="my-10 " />
        <CreateUserAccountForm user_id={user_id} role={role} className="pt-2"/>
        {/* <CreateSubAccountForm user_id={user_id} role={role} tier={tier} /> */}
      </CustomModal>
    );
  };
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col flex-grow flex-1 ">
      <div className="flex items-center justify-between py-4 ">
        <Input
          placeholder="Search user accounts..."
          value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Button
          className="flex items-center gap-2 text-sm"
          onClick={AddNewAccount}
        >
          <PlusCircledIcon />
          Add new users
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
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
            {table.getRowModel().rows?.length ? (
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
