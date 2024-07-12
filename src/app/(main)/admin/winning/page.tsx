import { currentUser, RetrieveAllUsers } from "@/server-actions";
import WinningUI from "./components/winning-ui";

export const revalidate = 0;
export default async function WinningPage() {
  const user = await currentUser();
  const users = await RetrieveAllUsers(user.id);

  if (!users) return;
  return (
    <div className="flex flex-col flex-1 flex-grow gap-2 bg-muted/40 p-4  md:p-10">
      <WinningUI users={users} />
    </div>
  );
}
