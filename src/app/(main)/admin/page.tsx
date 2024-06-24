import { DailyTimeFrame, ISOTimeFormater, WeekTimeFrame } from "@/lib/utils";
import {
  RetrieveAllSales,
  RetrieveAllUsers,
  RetrieveRootCommission,
  currentUser,
  currentUserRoleTier,
} from "@/server-actions";

import {
  IconCurrencyDollar,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import SalesTable from "./components/sales-table";
import { CardSales } from "./components/sales-card";
import { RoleTypeObj } from "@/lib/types";
import CommissionCard from "./components/sales-commission-card";

export default async function Home() {
  let monthlySales = 0;
  let weeklySales = 0;
  let dailySales = 0;
  let initial = 0;
  const user = await currentUser();
  const allSales = await RetrieveAllSales();
  const allUsers = await RetrieveAllUsers(user.id);
  const credentials = await currentUserRoleTier(user.id);
  const root_commission = await RetrieveRootCommission();

  if (allSales) {
    monthlySales = allSales?.reduce((accumulator, current) => {
      const { ticket_numbers } = current;
      const { number, category, amount } = ticket_numbers!;
      const pivot = number.length * amount * category.length;
      return (accumulator += pivot);
    }, initial);

    weeklySales = allSales
      ?.filter((sales) =>
        WeekTimeFrame().includes(ISOTimeFormater(sales.created_at))
      )
      .reduce((accumulator, current) => {
        const { ticket_numbers } = current;
        const { number, category, amount } = ticket_numbers!;
        const pivot = number.length * amount * category.length;
        return (accumulator += pivot);
      }, initial);

    dailySales = allSales
      ?.filter(
        (sales) => ISOTimeFormater(sales.created_at) === DailyTimeFrame()
      )
      .reduce((accumulator, current) => {
        const { ticket_numbers } = current;
        const { number, category, amount } = ticket_numbers!;
        const pivot = number.length * amount * category.length;
        return (accumulator += pivot);
      }, initial);
  }

  return (
    <div className="flex flex-col flex-1 flex-grow gap-2 bg-muted/40 p-4 space-y-[1rem] md:p-10">
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Dashboard
        </h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardSales
          title={"Monthly Sales"}
          type={"currency"}
          icon={IconCurrencyDollar}
          value={!monthlySales ? 0 : monthlySales}
          descriptions={""}
        />
        <CardSales
          title={"Weekly Sales"}
          type={"currency"}
          icon={IconCurrencyDollar}
          value={!weeklySales ? 0 : weeklySales}
          descriptions={""}
        />
        <CardSales
          title={"Daily Sales"}
          type={"currency"}
          icon={IconCurrencyDollar}
          value={!dailySales ? 0 : dailySales}
          descriptions={""}
        />
        <CardSales
          title={"Active Now"}
          type={"user"}
          icon={IconUsersGroup}
          value={
            !allUsers
              ? 0
              : allUsers.filter((item) => item.role !== "Dev").length
          }
          descriptions={`Currently active admin +${
            allUsers && allUsers.filter((user) => user.role === RoleTypeObj.Admin).length
          } and agent +${
            allUsers && allUsers.filter((user) => user.role === RoleTypeObj.Agent).length
          }`}
        />
      </div>
      {
        credentials?.role === RoleTypeObj.Owner && <CommissionCard commission_value={root_commission}/>
      }
      <SalesTable
        users={allUsers ? allUsers.filter((item) => item.role !== "Dev") : []}
        sales={allSales!}
      />
    </div>
  );
}
