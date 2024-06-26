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
  RetrieveAllUsers,
  RetrieveRootCommission,
  currentUser,
  currentUserRoleTier,
} from "@/server-actions";
import UsersAccountsDataTable from "./components/accounts-table";
import { columns } from "./components/accounts-table/columns";

export default async function UserPage() {
  const user = await currentUser();
  const data = await RetrieveAllUsers(user?.id);
  const credentials = await currentUserRoleTier(user?.id);
  const root_commission = await RetrieveRootCommission();
  return (
    <main className="flex flex-col flex-1 flex-grow gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <Card>
        <CardHeader>
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Manage Users</h1>
            <p className="text-muted-foreground">
              Control user&apos;s access activities.
            </p>
          </div>
          <CardContent className="p-0">
            <UsersAccountsDataTable
              columns={columns}
              data={data?.filter((item) => item.role !== "Dev")!}
              user_id={user.id}
              role={credentials?.role!}
              tier={credentials?.tier!}
              commRate={root_commission?.percent!}

            />
          </CardContent>
        </CardHeader>
      </Card>
    </main>
  );
}
