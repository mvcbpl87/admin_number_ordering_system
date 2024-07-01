"use client";
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { PasswordInput } from "@/components/custom/password-input";
import { cn } from "@/lib/utils";
import { UserAuthSchema, type UserAuthSchemaType } from "@/lib/types";
import { LoginAction } from "@/server-actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {
  searchParams: { message: string };
}
export function UserAuthForm({
  className,
  searchParams,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<UserAuthSchemaType>({
    resolver: zodResolver(UserAuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // const isLoading = form.formState.isLoading;

  async function onSubmit(data: UserAuthSchemaType) {
    try {
      setIsLoading(true);
      await LoginAction(data);
    } catch (err) {
      console.log("Error from login form", err);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div
      className={cn("mx-auto max-w-sm space-y-[1rem]", className)}
      {...props}
    >
      {searchParams?.message && (
        <div className="p-4 flex flex-col items-center bg-destructive text-background">
          {searchParams.message}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="admin@email.com"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* --- Password Field Input --- */}
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link
                            href="#d"
                            className="text-sm font-medium text-muted-foreground hover:opacity-75"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <PasswordInput placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" loading={isLoading}>
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
