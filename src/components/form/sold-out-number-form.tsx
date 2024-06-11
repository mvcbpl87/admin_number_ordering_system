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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "../custom/button";
import { format } from "date-fns";
import { useToast } from "../ui/use-toast";
import {
  CategoryList,
  SoldOutNumberSchema,
  SoldOutNumberSchemaType,
} from "@/lib/types";
import { IconImage } from "../shared/IconImgTemplate";
import { CalendarIcon } from "lucide-react";
import { Switch } from "../ui/switch";
import { ManageSoldOutNumber } from "@/server-actions";
import { useRouter } from "next/navigation";

interface SoldOutNumberFormProps extends HTMLAttributes<HTMLDivElement> {
  params: SoldOutNumbers | null;
  clientClick?: (data: SoldOutNumbers[]) => void;
  // setParams?: React.Dispatch<React.SetStateAction<SoldOutNumbers[]>>;
}

export default function SoldOutNumberForm({
  params,
  clientClick,
  className,
  ...props
}: SoldOutNumberFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const defaultValues: Partial<SoldOutNumberSchemaType> = {
    id: params ? params.id : "",
    number: params?.number ? `${params.number[0]}` : "",
    boxbet: params ? (params.number.length > 1 ? true : false) : false,
    draw_date: params ? new Date(params.draw_date) : undefined,
    category: params ? params.category : "",
  };
  const form = useForm<SoldOutNumberSchemaType>({
    resolver: zodResolver(SoldOutNumberSchema),
    mode: "onChange",
    defaultValues,
  });
  const isLoading = form.formState.isLoading;
  const onSubmit = async (values: SoldOutNumberSchemaType) => {
    try {
      const data = await ManageSoldOutNumber(values);
      if (clientClick && data) clientClick(data);
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
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={!field.value ? "" : field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              field.value ? field.value : "Select shop category"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CategoryList.map((category) => (
                          <SelectItem value={category.name} key={category.name}>
                            <div className="flex items-center gap-2 py-2">
                              <IconImage
                                src={category.src}
                                alt={category.alt}
                              />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Form Field for Draw date */}
              <FormField
                control={form.control}
                name="draw_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Draw date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem className="py-6">
                    <FormLabel className="text-center bg-red-200 w-full">
                      <div>Sold out number </div>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center">
                          <InputOTP maxLength={4} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} className="w-16 h-16" />
                              <InputOTPSlot index={1} className="w-16 h-16" />
                              <InputOTPSlot index={2} className="w-16 h-16" />
                              <InputOTPSlot index={3} className="w-16 h-16" />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                          {field.value === "" ? (
                            <>Enter sold out number.</>
                          ) : (
                            <>You entered: {field.value}</>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
              {/* Box bet switch */}
              <FormField
                control={form.control}
                name="boxbet"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Boxbet</FormLabel>
                      <FormDescription className=" text-xs">
                        Turn on this will boxbet this sold number into B4, B12,
                        or B24 format;
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" loading={isLoading}>
              Add new sold out numbers
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
