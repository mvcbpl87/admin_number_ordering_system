"use client";
import { HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordInput } from "@/components/custom/password-input";
import { cn } from "@/lib/utils";
import { Button } from "../custom/button";
import { Input } from "@/components/ui/input";
import { useToast } from "../ui/use-toast";
import { CreditTopupSchema, CreditTopupSchemaType } from "@/lib/types";
import { number } from "zod";
import { UpsertUserCredits } from "@/server-actions";
import { useModal } from "../provider/modal-provider";
import { useRouter } from "next/navigation";
import path from "@/lib/path";

interface CreditTopupFormProps extends HTMLAttributes<HTMLDivElement> {
  user_id: string;
  credit_value: number;
}

export default function CreditTopupForm({
  className,
  user_id,
  credit_value,
  ...props
}: CreditTopupFormProps) {
  const { toast } = useToast();
  const { setClose } = useModal();
  const router = useRouter();
  const defaultValues: Partial<CreditTopupSchemaType> = {
    user_id,
    credit_value,
  };

  const form = useForm<CreditTopupSchemaType>({
    resolver: zodResolver(CreditTopupSchema),
    mode: "onChange",
    defaultValues,
  });
  const isLoading = form.formState.isLoading;
  const onSubmit = async (values: CreditTopupSchemaType) => {
    try {
      await UpsertUserCredits(values.user_id, values.credit_value);
      toast({
        variant: "successful",
        title: "Successfully topup credit",
        description: `You have successfully topup RM${values.credit_value.toFixed(
          2
        )} credits`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    } finally {
      setClose();
      router.push(path.users);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="credit_value"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Credit value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter credit value eg. 0"
                      type="number"
                      value={field.value}
                      onChange={(e) => {
                        if (Number(e.target.value) < 0) return;
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" loading={isLoading}>
              Topup credits
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
