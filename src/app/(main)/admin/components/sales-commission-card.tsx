"use client";
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
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { IconEdit, IconEditCircle } from "@tabler/icons-react";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UpsertRootCommission } from "@/server-actions";

interface CommissionCardProps {
  commission_value: RootCommission | undefined;
}

export default function CommissionCard({
  commission_value,
}: CommissionCardProps) {
  const { toast } = useToast();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [commValue, setCommValue] = useState<number>(
    !commission_value ? 0 : commission_value.percent
  );

  const updateCommission = (values: RootCommission) => {
    let temp = values;
    temp["percent"] = commValue;
    return temp;
  };
  const handleEdit = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(e.target.value))) {
      setCommValue(Number(e.target.value));
    }
  };
  const handleSave = async () => {
    try {
      if (commValue < 0) return;
      setIsSaving(true);
      const updatedCommission = await UpsertRootCommission(
        updateCommission(commission_value!)
      );
      if (updatedCommission) setCommValue(updatedCommission.percent);
      toast({
        variant: "successful",
        title: "Successfully set commission %",
        description: `You have successfully set commission %`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${err}`,
      });
    } finally {
      setIsSaving(false);
      setIsEdit(!isEdit);
    }
  };

  return (
    <AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle>Commission %</CardTitle>
          <CardDescription>
            Used to set up commission of sales for agents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input
              placeholder="Commission percent %"
              readOnly={!isEdit}
              value={commValue}
              onChange={handleEdit}
            />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          {!isEdit ? (
            <Button
              size="sm"
              className=" gap-1 flex items-center"
              onClick={() => setIsEdit(!isEdit)}
            >
              <span>Edit commission</span>
              <IconEdit className="h-4 w-4" />
            </Button>
          ) : (
            <AlertDialogTrigger>
              <Button
                size="sm"
                className=" gap-1 flex items-center bg-green-500 text-background"
                variant={"ghost"}
              >
                <span>Save winning number</span>
                {isSaving ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
          )}
        </CardFooter>
      </Card>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you wish to save commission rate?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action only can be done by owner and will set commission rate
            for default all agents.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
