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
import CreditTopupForm from "@/components/form/credits-topup-form";

export const columns: ColumnDef<UserAccountColumnType, any>[] = [
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
    cell: ({ row }) => {
      const { commission, role } = row.original;
      if (role === RoleTypeObj.Admin)
        return <div className="text-center">none</div>;
      return <div className="text-center">{`${commission?.percent}%`}</div>;
    },
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
            ? `${row.getValue("tier")}`
            : `Tier-${row.getValue("tier")}`}
        </Badge>
      </div>
    ),
  },
  {
    id: "credits",
    accessorFn: (item) => item.credits?.credit_value,
    header: "credits",
    cell: ({ row }) => {
      const { credits } = row.original;
      return (
        <div>
          {credits ? (
            `RM${credits.credit_value.toFixed(2)}`
          ) : (
            <Badge variant={"secondary"}>none</Badge>
          )}
        </div>
      );
    },
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
        title="Manage user account"
        subheading="Manage user account to update user credentials."
      >
        <ManageUserAccountForm credentials={data} user_id={user_id} />
      </CustomModal>
    );
  };

  const handleTopUp = () => {
    if (!data.credits) {
      toast({
        title: "Reminder",
        description: `Unable to top up credit for this user`,
      });
      return;
    }
    modal.setOpen(
      <CustomModal
        title="Topup credits"
        subheading="Topup agent credits with certain amount."
      >
        <CreditTopupForm
          user_id={user_id}
          credit_value={data.credits?.credit_value!}
          className="pt-2"
        />
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
          <DropdownMenuItem onClick={handleTopUp}>
            Topup credits
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
