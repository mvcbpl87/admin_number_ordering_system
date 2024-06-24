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
import { useRouter } from "next/navigation";
import { BuyNumberSchema, BuyNumberSchemaType } from "@/lib/types";
import { IconTicket } from "@tabler/icons-react";
import { Badge } from "../ui/badge";

interface BuyNumberFormProps extends HTMLAttributes<HTMLDivElement> {
  params: TicketBought;
}

export default function BuyNumberForm({
  className,
  params,
  ...props
}: BuyNumberFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const defaultValues: Partial<BuyNumberSchemaType> = {
    number: params.number,
    total_big: params.total_big,
    total_small: params.total_small,
  };

  const form = useForm<BuyNumberSchemaType>({
    resolver: zodResolver(BuyNumberSchema),
    mode: "onChange",
    defaultValues,
  });
  const isLoading = form.formState.isLoading;
  const onSubmit = async (values: BuyNumberSchemaType) => {
    try {
      //   const data = await ManageSoldOutNumber(values);
      console.log(values);
      toast({
        variant: "successful",
        title: "Successfully create subaccount",
        description: `You have successfully create a subaccount`,
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    } finally {
    }
  };
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 pt-6">
            <div className=" flex items-center gap-2">
              <h1 className="text-2xl font-semibold">
                Number: {params.number}
              </h1>
              <Badge>
                {" "}
                Total value : RM{" "}
                {(params.total_big + params.total_small).toFixed(2)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="total_big"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Buy Big</FormLabel>
                    <FormControl>
                      <Input placeholder="Buy big" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total_small"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Buy Small</FormLabel>
                    <FormControl>
                      <Input placeholder="Buy small" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full flex items-center gap-2"
              loading={isLoading}
            >
              <span>Buy numbers</span>
              <IconTicket size={15} />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
