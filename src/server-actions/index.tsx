"use server";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import path from "@/lib/path";
import {
  CreateUserAccountSchemaType,
  ManageUserAccountSchemaType,
  RoleTypeObj,
  SoldOutNumberSchemaType,
  UserAuthSchemaType,
} from "@/lib/types";
import { createSupabaseAdmin } from "@/supabase/client";
import { revalidatePath } from "next/cache";
import { getUniquePermutation } from "@/lib/game-utils/permutation";
import { formatDate, startOfMonth, endOfMonth } from "@/lib/utils";
import { DatePreset } from "@/lib/game-utils/draw-date-generator";

/* --- Authentication user action ---  */
export async function currentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(path.login);
  return user;
}
export async function currentUserRoleTier(user_id: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("users")
      .select("role, tier")
      .eq("id", user_id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function currentUserCredentials(user_id: string) {
  try {
    const supabase = createClient();
    const { error, data } = await supabase
      .from("users")
      .select("*, commission(*)")
      .eq("id", user_id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function LoginAction(values: UserAuthSchemaType) {
  const supabase = createClient();
  const role = await supabase
    .from("users")
    .select("role")
    .eq("email", values.email)
    .single();

  if (role.error)
    return redirect(`${path.login}?message=Cannot authenticate admin`);

  if (role.data.role === "Agent")
    return redirect(`${path.login}?message=Not authorize account for admin`);

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });
  if (error) {
    return redirect(`${path.login}?message=Could not authenticate admin`);
  }
  return redirect(path.admin);
}

export async function LogoutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect(path.login);
}
/* --- End of Authentication user action ---  */

/* --- Read All Users except current self ---*/
export async function RetrieveAllUsers(user_id: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*, commission(*)")
      .neq("id", user_id);
    if (error) throw new Error(error.message);

    return data;
  } catch (err) {
    console.log(err);
  }
}

/* --- Read Commission percent (root)(!Im: HQ Specified) ---- */
export async function RetrieveRootCommission() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("root_commission")
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.log(error);
  }
}

/* --- Read All Ticket Orders (all sales) for within a current month --- */
export async function RetrieveAllSales() {
  try {
    const currDate = new Date();
    const supabase = createClient();

    const { error, data } = await supabase
      .from("customer_orders")
      .select("*, ticket_numbers(*)")
      .gte("created_at", formatDate(startOfMonth(currDate)))
      .lte("created_at", formatDate(endOfMonth(currDate)));
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}

/* --- Read Target Sales for selected category and draw_date --- */
export async function RetrieveTargetSales(category: string, draw_date: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("ticket_numbers")
      .select()
      .contains("category", [category])
      .eq("draw_date", draw_date);
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}

/* --- Read all prizes type --- */
export async function RetrievePrizes() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("prizes")
      .select("id, prize_type, prize_value");
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}

/* --- (!Special Case) Initialize Winning Numbers if not exist --- */
export async function InitWinningNumbers(
  category: string,
  gametype: string,
  draw_date: string
) {
  let temp = [] as Partial<WinningNumbers>[];
  try {
    const prizes = await RetrievePrizes();
    if (!prizes) throw new Error("Unable to fetch prizes");

    const ExpandNumberTemplate = Array.from(new Array(10), (i) => (i = 0));
    for (let prize of prizes) {
      let item: Partial<WinningNumbers> = {
        number:
          prize.prize_type === "Special" || prize.prize_type === "Consolation"
            ? ExpandNumberTemplate
            : [0],
        gametype,
        draw_date,
        category,
        prize_id: prize.id,
      };
      temp.push(item);
    }
    return temp;
  } catch (err) {
    console.log(err);
  }
}

export async function RetrieveWinningNumbers(
  category: string,
  gametype: string,
  draw_date: string
) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("winning_numbers")
      .select("*, prizes(*)")
      .eq("category", category)
      .eq("gametype", gametype)
      .eq("draw_date", draw_date);
    if (error) throw new Error(error.message);

    if (data.length === 0) {
      const presetDrawDates = new DatePreset().GET_DRAW_DATE();
      if (!presetDrawDates.includes(draw_date)) return;

      const initParams = await InitWinningNumbers(
        category,
        gametype,
        draw_date
      );

      const initData = await CreateWinningNumbers(initParams);
      if (!initData) throw new Error("Unable to create winning number");
      return initData;
    }
    return data.map((item) => ({ ...item, prizes: item.prizes as Prizes }));
  } catch (err) {
    console.log(err);
  }
}

/* --- (!Special Case) Initialize Winning Orders if not exist --- */
export async function InitWinningOrders(draw_date: string) {}

/* --- Retrieve Winning Orders ---*/
export async function RetrieveWinningOrders(
  winning_number: WinningNumbersWPrize[],
  category: string,
  gametype: string,
  draw_date: string
) {
  try {
    let temp: WinningOrders[] = [];
    const supabase = createClient();

    /* 1) Display exisiting winning order for particular draw_date */
    const { data, error } = await supabase
      .from("winning_orders")
      .select(
        "*, customer_orders(id, phone_number, users(username, email)), prizes(prize_type, prize_value) "
      )
      .eq("draw_date", draw_date)
      .eq("gametype", gametype)
      .eq("category", category);

    if (error) throw new Error(error.message);

    /* 2) !important initialize winning order */
    if (data.length === 0) {
      for await (let won_num of winning_number) {
        /* 3) Search ticket numbers that won based on draw_date, gametype, category (array) and winning number (array) */
        const { data, error } = await supabase
          .from("ticket_numbers")
          .select("*, customer_orders(id)")
          .eq("draw_date", draw_date)
          .eq("gametype", gametype)
          .contains("category", [category])
          .overlaps("number", won_num.number);

        if (error) throw new Error(error.message);
        const sortOrder: WinningOrders[] = data.map((order) => ({
          customer_id: order.customer_orders[0].id,
          prize_id: won_num.prizes.id,
          number: won_num.number.filter((number) =>
            order.number.includes(number)
          ),
          gametype,
          draw_date: won_num.draw_date,
          category: won_num.category,
          claimed: false,
        }));
        temp.push(...sortOrder);
      }
      const data = CreateWinningOrders(temp);
      return data;
    }

    return data;
  } catch (err) {
    console.log(err);
  }
}

/* --- Retrieve Sold Out Number ---- */
export async function RetrieveSoldOutNumbers(
  category: string,
  draw_date: string
) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("sold_out_number")
      .select()
      .match({
        category,
        draw_date,
      });

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.log(error);
  }
}
/** Create or set new winning numbers (Bulk) */
export async function CreateWinningNumbers(values: any) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("winning_numbers")
      .insert(values)
      .select("*, prizes(*)");
    if (error) throw new Error(error.message);
    return data.map((item) => ({ ...item, prizes: item.prizes as Prizes }));
  } catch (err) {
    console.log(err);
  }
}

/** Create winning orders (Bulk or single) */
export async function CreateWinningOrders(values: WinningOrders[]) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("winning_orders")
      .insert(values)
      .select(
        "*, customer_orders(id, phone_number, users(username, email)), prizes(prize_type, prize_value) "
      );
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}
/** Create new user account **/
export async function CreateUserAccountAction(
  values: CreateUserAccountSchemaType
) {
  try {
    const isAdmin = values.role === RoleTypeObj.Admin;

    const supabase = createSupabaseAdmin();
    const { data, error } = await (
      await supabase
    ).auth.admin.createUser({
      email: values.email,
      password: values.password,
      email_confirm: true,
      user_metadata: {
        username: values.username,
        email: values.email,
        role: values.role,
        parent: values.parent,
        tier: isAdmin ? "none" : `${Number(values.tier)}`,
      },
    });
    if (error) throw new Error(error.message);
    if (data && !isAdmin)
      await UpsertUserCommission(data.user.id, values.percent);

    return revalidatePath(path.users);
  } catch (err) {
    console.log(err);
  }
}
export async function UpsertUserCommission(user_id: string, percent: number) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("commission")
      .upsert({ id: user_id, percent })
      .select();
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function UpsertWinningClaim(values: WinningOrdersWCredentials) {
  let temp: WinningOrders = {
    customer_id: values.customer_id,
    prize_id: values.prize_id,
    number: values.number,
    draw_date: values.draw_date,
    gametype: values.gametype,
    category: values.category,
    claimed: values.claimed,
  };
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("winning_orders")
      .upsert(temp)
      .select(
        "*, customer_orders(id, phone_number, users(username, email)), prizes(prize_type, prize_value) "
      );
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}
/* --- Create Sold Out Number --- */
export async function ManageSoldOutNumber(values: SoldOutNumberSchemaType) {
  let permutations: Number[] = [];
  let params: any = {};
  try {
    var sold_num = Array.from(values.number).map((num) => Number(num));
    params = {
      number: [Number(sold_num.join(""))] as Number[],
      draw_date: formatDate(values.draw_date),
      category: values.category,
    };
    if (values.boxbet) {
      permutations = getUniquePermutation(sold_num);
      params["number"] = permutations;
    }

    const supabase = createClient();
    if (!values.id) {
      const { data, error } = await supabase
        .from("sold_out_number")
        .insert(params as SoldOutNumbers)
        .select();
      if (error) throw new Error(error.message);
      return data;
    } else {
      params["id"] = values.id;
      const { data, error } = await supabase
        .from("sold_out_number")
        .upsert(params as SoldOutNumbers)
        .select();
      if (error) throw new Error(error.message);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function UpsertRootCommission(values: RootCommission) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("root_commission")
      .upsert(values)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}
/** Update User Credentials */
export async function UpdateUserAccountAction(
  user_id: string,
  values: ManageUserAccountSchemaType
) {
  let params = {
    email: values.email,
    user_metadata: {
      username: values.username,
      email: values.email,
      role: values.role,
      tier: `${Number(values.tier)}`,
    },
  } as any;

  if (values.password) params["password"] = values.password;
  try {
    const supabaseAdmin = createSupabaseAdmin();
    const { data, error } = await (
      await supabaseAdmin
    ).auth.admin.updateUserById(user_id, params);

    if (error) throw new Error();
    if (data.user?.user_metadata) {
      const metadata = data.user.user_metadata;
      const supabase = createClient();
      const { error } = await supabase
        .from("users")
        .update({
          username: metadata.username,
          email: metadata.email,
          role: metadata.role,
          tier: metadata.tier,
        })
        .eq("id", user_id);
      if (error) throw new Error(error.message);
      await UpsertUserCommission(data.user.id, values.percent);
    }
    return revalidatePath(path.users);
  } catch (err) {
    console.log(err);
  }
}

/* Update Current user credentials */
export async function UpdateCurrentUserAccountAction(
  values: CreateUserAccountSchemaType
) {
  try {
    const supabase = createSupabaseAdmin();
    const { error } = await (
      await supabase
    ).auth.updateUser({
      email: values.email,
      password: values.password,
      data: {
        username: values.username,
        email: values.email,
        role: values.role,
        tier: `${Number(values.tier)}`,
      },
    });
    if (error) throw new Error();

    return revalidatePath(path.users);
  } catch (err) {
    console.log(err);
  }
}

/* Update Winning Number */
export async function UpdateWinningNumbers(values: WinningNumbers[]) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("winning_numbers")
      .upsert(values as WinningNumbers[])
      .select();
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
  }
}
/* Delete User account */
export async function DeleteUserAccountAction(user_id: string) {
  try {
    const supabase = createSupabaseAdmin();

    const { error } = await (await supabase).auth.admin.deleteUser(user_id);
    if (error) throw new Error();

    return revalidatePath(path.users);
  } catch (err) {
    console.log(err);
  }
}

/* Delete Current Winning Number by draw date*/
export async function DeleteWinningOrders(draw_date: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("winning_orders")
      .delete()
      .eq("draw_date", draw_date);
    if (error) throw new Error(error.message);
  } catch (err) {
    console.log(err);
  }
}

/* Delete Sold Out Number */
export async function DeleteSoldOutNumbers(id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("sold_out_number")
      .delete()
      .eq("id", id)
      .select();
    if (error) throw new Error(error.message);
  } catch (err) {
    console.log(err);
  }
}
