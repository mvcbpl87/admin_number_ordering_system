import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { CustomModal } from "@/components/shared/custom-modal";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/components/provider/modal-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { DeleteSoldOutNumbers, RetrieveSoldOutNumbers } from "@/server-actions";
import { formatDate } from "@/lib/utils";
import SoldOutNumberForm from "@/components/form/sold-out-number-form";

interface SoldOutTableProps {
  category: string | null;
  drawDate: Date | undefined;
  data: SoldOutNumbers[];
  setData: React.Dispatch<React.SetStateAction<SoldOutNumbers[]>>;
}
export default function SoldOutTable({
  category,
  drawDate,
  data,
  setData,
}: SoldOutTableProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSoldOutNumber = async () => {
    if (!category || !drawDate) return;
    try {
      setIsLoading(true);
      const soldOutNum = await RetrieveSoldOutNumbers(
        category,
        formatDate(drawDate)
      );
      if (soldOutNum) setData(soldOutNum);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSoldOutNumber();
  }, [category, drawDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sold Out Numbers</CardTitle>
        <CardDescription>
          Manage sold out numbers accordingly to shop category.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Draw date</TableHead>
              <TableHead>Boxbet</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 ">
                  <div className=" flex items-center justify-center">
                    <Loader2 className="animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length !== 0 ? (
              data
                .filter(
                  (item) =>
                    item.draw_date == formatDate(drawDate!) &&
                    item.category == category
                )
                .map((data, index) => (
                  <TableRow key={`sold-out-${index + 1}`}>
                    <TableCell className="font-medium">
                      {data.number[0]}
                    </TableCell>
                    <TableCell>{data.draw_date}</TableCell>
                    <TableCell>
                      <Badge variant={"secondary"}>
                        {data.number.length > 1
                          ? `B${data.number.length}`
                          : "none"}
                      </Badge>
                    </TableCell>
                    <TableCell>{data.category}</TableCell>
                    <TableCell>
                      <ActionDropdown data={data} setData={setData} />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ActionDropdown({
  data,
  setData,
}: {
  data: SoldOutNumbers;
  setData: React.Dispatch<React.SetStateAction<SoldOutNumbers[]>>;
}) {
  const modal = useModal();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await DeleteSoldOutNumbers(data.id)
      setData(prev => {
        return prev.filter(item => item.id !== data.id)
      });
      toast({
        title: "Delete sold out number ",
        description: `You have deleted ${data.number[0]} `,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    }
  };
  const handleEdit = () => {
    const edit_Fn = (data: SoldOutNumbers[]) => {
      setData((prev) => {
        const existingItems = [...prev];
        var ItemIndex = existingItems.findIndex(
          (currItem) => currItem.id === data[0].id
        );
        existingItems[ItemIndex] = data[0];
        return existingItems;
      });
    };
    modal.setOpen(
      <CustomModal
        title="Manage Sub Account"
        subheading="Manage agent sub account to update subaccounts credentials"
      >
        <SoldOutNumberForm params={data} clientClick={edit_Fn} />
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
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
