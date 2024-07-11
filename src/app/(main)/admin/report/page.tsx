import { currentUser, RetrieveAllUsers } from "@/server-actions";
import ReportUI from "./components.tsx/report-ui";

export default async function ReportPage() {
  const user = await currentUser();
  const allUsers = await RetrieveAllUsers(user.id);
  if (!allUsers) return <div></div>;
  return (
    <div className="flex flex-col flex-1 flex-grow gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <ReportUI users={allUsers} />
    </div>
  );
}
