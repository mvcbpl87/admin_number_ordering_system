"use client";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CustomModal } from "@/components/shared/custom-modal";
import { useModal } from "@/components/provider/modal-provider";
import BuyNumberForm from "@/components/form/buy-number-form";

// export interface SalesColumnType {
//   number: string;
//   total_big: number;
//   total_small: number;
//   total_value: number;
// }
export type SalesColumnType = TicketBought;
export const columns: ColumnDef<SalesColumnType>[] = [
  {
    accessorKey: "number",
    header: "Number",
    cell: ({ row }) => <div>{row.getValue("number")}</div>,
  },
  {
    accessorKey: "total_big",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Big
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("total_big")}</div>,
  },
  {
    accessorKey: "total_small",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Small
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("total_small")}</div>,
  },
  {
    accessorKey: "total_value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Value
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("total_value")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;
      return <ActionDropdown data={data} />;
    },
  },
];

function ActionDropdown({ data }: { data: TicketBought }) {
  const modal = useModal();
  // const { toast } = useToast();

  // const handleClick = async () => {
  //   try {
  //     await DeleteUserAccountAction(user_id)
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong.",
  //       description: `${error}`,
  //     });
  //   }
  // };
  const handleEdit = () => {
    modal.setOpen(
      <CustomModal
        title="Buy number"
        subheading="Manage desired value for both big and small gametype"
      >
        <BuyNumberForm params={data} />
        {/* <ManageUserAccountForm credentials={data} user_id={user_id} /> */}
        {/* <ManageSubAccountForm credentials={data} /> */}
      </CustomModal>
    );
  };
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <DotsVerticalIcon className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem>
            <AlertDialogTrigger>Delete</AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {}}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
