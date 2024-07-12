import React from "react";
import { z } from "zod";

export const UserAuthSchema = z.object({
  email: z.string().email({ message: "Please enter your email" }),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
});

export const CreateUserAccountSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  username: z.string().min(1, { message: "Please enter your username" }),
  role: z.string(),
  parent: z.string(),
  tier: z.string(),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
  percent: z.number({ required_error: "Required commission rate" }),
});

export const ManageUserAccountSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  username: z.string().min(1, { message: "Please enter your username" }),
  role: z.string(),
  tier: z.string(),
  password: z.string(),
  percent: z.number({ required_error: "Required commission rate" }),
});

export const SoldOutNumberSchema = z.object({
  id: z.string(),
  number: z.string().min(4, { message: "Required sold out number" }),
  boxbet: z.boolean(),
  draw_date: z.date({
    required_error: "Required draw date",
  }),
  category: z.string().min(1, { message: "Required shop category" }),
});

export const BuyNumberSchema = z.object({
  number: z.string().min(1, { message: "Required number" }),
  total_big: z.number().min(1, { message: "Required amount to buy big" }),
  total_small: z.number().min(1, { message: "Required amount to buy small" }),
});

export const UserProfileSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  role: z.string(),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
});

export type UserProfileSchemaType = z.infer<typeof UserProfileSchema>;
export type UserAuthSchemaType = z.infer<typeof UserAuthSchema>;
export type CreateUserAccountSchemaType = z.infer<
  typeof CreateUserAccountSchema
>;
export type ManageUserAccountSchemaType = z.infer<
  typeof ManageUserAccountSchema
>;
export type SoldOutNumberSchemaType = z.infer<typeof SoldOutNumberSchema>;
export type BuyNumberSchemaType = z.infer<typeof BuyNumberSchema>;
export type TierType = "1" | "2" | "3";
export type RoleType = "Owner" | "Admin" | "Agent";
type RoleTypeObjType = {
  [key in RoleType]: String;
};
export const TierTypeList: TierType[] = ["1", "2", "3"];
export const RoleTypeList: RoleType[] = ["Owner", "Admin", "Agent"];
export const RoleTypeObj: RoleTypeObjType = {
  Owner: "Owner",
  Admin: "Admin",
  Agent: "Agent",
};
// export type UserAccountColumnType = {
//   id: string;
//   email: string | null;
//   username: string | null;
//   role: string | null;
//   tier: string;
// };

export type ReportColumnType = {
  draw_date: string;
  total_big: number;
  total_small: number;
  total_sales: number;
};

export type UserAccountColumnType = UsersWCommission;

export type shopType =
  | "Damacai"
  | "Cash Sweep"
  | "88 Diriwan"
  | "Magnum 4D"
  | "4D STC"
  | "Sports Toto";

export type CategoryListType = {
  src: string;
  alt: string;
  name: shopType;
  tag: string;
};
export const CategoryList: CategoryListType[] = [
  {
    src: "/assets/damacai.png",
    alt: "damacai",
    name: "Damacai",
    tag: "damacai",
  },
  {
    src: "/assets/cash-sweep.png",
    alt: "cash sweep",
    name: "Cash Sweep",
    tag: "cash_sweep",
  },
  {
    src: "/assets/double-eight.png",
    alt: "double eight",
    name: "88 Diriwan",
    tag: "diriwan_88",
  },
  {
    src: "/assets/magnum-4d.png",
    alt: "magnum",
    name: "Magnum 4D",
    tag: "magnum_4d",
  },
  {
    src: "/assets/stc-4d.png",
    alt: "Sandakan Turf Club",
    name: "4D STC",
    tag: "stc_4d",
  },
  {
    src: "/assets/toto-4d.png",
    alt: "Sports toto",
    name: "Sports Toto",
    tag: "sport_toto",
  },
];

export type ReduceWinningOrderType = {
  id: string;
  username: string;
  email: string;
  total_payout: number;
  total_claimed: number;
  data: WinningOrdersWCredentials[];
};