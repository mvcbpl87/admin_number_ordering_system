"use client";
import { Button } from "@/components/ui/button";
import { RoleTypeObj, UserAccountColumnType } from "@/lib/types";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useModal } from "@/components/provider/modal-provider";
import { CustomModal } from "@/components/shared/custom-modal";
import { ManageUserAccountForm } from "@/components/form/manage-user-account";
import { DeleteUserAccountAction } from "@/server-actions";

export const columns: ColumnDef<UserAccountColumnType, any>[] = [
  {
    accessorKey: "id",
    header: "user id",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <div>{id.substring(0, 8)}</div>;
    },
  },
  {
    accessorKey: "username",
    header: "users",
    cell: ({ row }) => {
      const { username, email } = row.original;
      return (
        <div className="flex flex-col gap-2 items-center text-start">
          <div>{username}</div>
          <div>{email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "commission",
    header: "comm. rate (%)",
    cell: ({ row }) => (
      <div className="text-center">{`${row.original.commission?.percent}%`}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "role",
    cell: ({ row }) => (
      <div>
        {" "}
        <Badge variant="outline">{row.getValue("role")}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "tier",
    header: "tier",
    cell: ({ row }) => (
      <div>
        <Badge variant="secondary">
          {row.original.role === RoleTypeObj.Admin
            ? `none`
            : `Tier-${row.getValue("tier")}`}
        </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;
      const user_id = data.id;
      return <ActionDropdown user_id={user_id} data={data} />;
    },
  },
];

function ActionDropdown({
  user_id,
  data,
}: {
  user_id: string;
  data: UserAccountColumnType;
}) {
  const modal = useModal();
  const { toast } = useToast();

  const handleClick = async () => {
    try {
      await DeleteUserAccountAction(user_id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    }
  };
  const handleEdit = () => {
    modal.setOpen(
      <CustomModal
        title="Manage Sub Account"
        subheading="Manage agent sub account to update subaccounts credentials"
      >
        <ManageUserAccountForm credentials={data} user_id={user_id} />
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
          <AlertDialogAction onClick={handleClick}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
