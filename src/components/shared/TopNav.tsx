import { LogoutAction, currentUser } from "@/server-actions";
import { Button, buttonVariants } from "../ui/button";
import { Link } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function TopNav() {
  const user = await currentUser();

  return (
    <div className="h-[var(--header-height)] p-6 flex items-center justify-end">
      {user ? (
        <div className="flex items-center gap-4 text-sm">
          Hey, {user.email?.split("@agent.auth")[0]}&nbsp;!
          <form action={LogoutAction}>
            <Button size={"sm"}>Logout</Button>
          </form>
        </div>
      ) : (
        <Link href="/login" className={cn(buttonVariants({ size: "sm" }))}>
          Login
        </Link>
      )}
    </div>
  );
}
