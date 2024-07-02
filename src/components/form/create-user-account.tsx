"use client";
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
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
import {
  CreateUserAccountSchema,
  CreateUserAccountSchemaType,
  RoleTypeList,
  RoleTypeObj,
  TierTypeList,
} from "@/lib/types";
import { CreateUserAccountAction } from "@/server-actions";
import { useModal } from "../provider/modal-provider";

interface CreateUserAccountFormProps extends HTMLAttributes<HTMLDivElement> {
  user_id: string;
  parent_role: string;
  commRate: number;
}

export function CreateUserAccountForm({
  className,
  parent_role,
  user_id,
  commRate,
  ...props
}: CreateUserAccountFormProps) {
  const [roleField, setRoleField] = useState<string>("Agent");
  const { toast } = useToast();
  const { setClose } = useModal();
  const defaultValues: Partial<CreateUserAccountSchemaType> = {
    email: "",
    username: "",
    password: "",
    parent: user_id,
    role: "Agent",
    tier: "1",
    percent: commRate,
  };
  const form = useForm<CreateUserAccountSchemaType>({
    resolver: zodResolver(CreateUserAccountSchema),
    mode: "onChange",
    defaultValues,
  });
  const isLoading = form.formState.isLoading;
  const onSubmit = async (values: CreateUserAccountSchemaType) => {
    try {
      await CreateUserAccountAction(values);
      toast({
        variant: "successful",
        title: "Successfully create subaccount",
        description: `You have successfully create a subaccount`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    } finally {
      setClose();
    }
  };

  /* --- Constraint for setting up role -- */
  const RoleAccessPermission = (current_role: string) => {
    if (!current_role) return RoleTypeList;
    if (current_role === RoleTypeObj.Owner)
      return RoleTypeList.filter((role) => role !== RoleTypeObj.Owner);
    return RoleTypeList.filter((role) => role === RoleTypeObj.Agent);
  };
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setRoleField(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              field.value ? field.value : "Select type of role"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RoleAccessPermission(parent_role).map((role) => (
                          <SelectItem value={role} key={`role-${role}`}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier</FormLabel>
                    <Select onValueChange={field.onChange} disabled>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              field.value ? field.value : "Select type of tier"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TierTypeList.map((tier) => (
                          <SelectItem value={tier} key={`tier-${tier}`}>
                            {tier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g 0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="percent"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Commission rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="20%"
                        value={field.value}
                        onChange={(e) => {
                          if (Number(e.target.value) < 0) return;
                          if (!isNaN(Number(e.target.value))) {
                            field.onChange(Number(e.target.value));
                          }
                        }}
                        type="number"
                        readOnly={parent_role !== RoleTypeObj.Owner}
                        disabled={roleField === RoleTypeObj.Admin}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                    </div>
                    <FormControl>
                      <PasswordInput placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>
              Create an account
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
