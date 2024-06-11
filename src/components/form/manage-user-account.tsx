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

import {
  ManageUserAccountSchema,
  ManageUserAccountSchemaType,
  RoleTypeList,
  TierTypeList,
  UserAccountColumnType,
} from "@/lib/types";
import { UpdateUserAccountAction } from "@/server-actions";

interface ManageUserAccountFormProps extends HTMLAttributes<HTMLDivElement> {
  user_id: string;
  credentials: UserAccountColumnType;
}

export function ManageUserAccountForm({
  className,
  user_id,
  credentials,
  ...props
}: ManageUserAccountFormProps) {
  const { toast } = useToast();
  const defaultValues: Partial<ManageUserAccountSchemaType> = {
    email: !credentials.email ? "" : credentials.email,
    username: !credentials.username ? "" : credentials.username,
    role: !credentials.role ? "" : credentials.role,
    tier: !credentials.tier ? "1" : credentials.tier,
    password: "",
  };
  const form = useForm<ManageUserAccountSchemaType>({
    resolver: zodResolver(ManageUserAccountSchema),
    mode: "onChange",
    defaultValues,
  });
  const isLoading = form.formState.isLoading;
  const onSubmit = async (values: ManageUserAccountSchemaType) => {
    try {
      //   console.log(user_id, values);
      await UpdateUserAccountAction(user_id, values);
      //   await CreateUserAccountAction(values);
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange}>
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
                        {RoleTypeList.filter((item) => item !== "Owner").map(
                          (role) => (
                            <SelectItem value={role} key={`role-${role}`}>
                              {role}
                            </SelectItem>
                          )
                        )}
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
                    <Select onValueChange={field.onChange}>
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
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                    </div>
                    <FormControl>
                      <PasswordInput placeholder="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter new password if you wish to overwrite old password.{" "}
                      <br />
                      Note. Password must be at least 7 characters long
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>
              Save credentials
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
