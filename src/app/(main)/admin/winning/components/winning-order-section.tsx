import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { cn, formatDate } from "@/lib/utils";
import FetchWinningOrder from "./hooks/fetch-winning-order";
import { Loader2, MoreVertical } from "lucide-react";
import { useState } from "react";
import { ReduceWinningOrderType } from "@/lib/types";

interface WinnerSectionProps {
  category: string | null;
  gametype: string | null;
  draw_date: Date | undefined;
  winning_number: WinningNumbersWPrize[];
  users: UsersWCommission[];
}
export default function WinningOrderSection({
  category,
  gametype,
  draw_date,
  winning_number,
  users,
}: WinnerSectionProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { isLoading, data } = FetchWinningOrder({
    category,
    gametype,
    draw_date,
    winning_number,
    users,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Winners</CardTitle>
        <CardDescription>
          Manage your winners and set their prizes.
        </CardDescription>
        <div className="flex items-center gap-2">
          {category && <Badge variant={"secondary"}>{category}</Badge>}
          {draw_date && (
            <Badge variant={"secondary"}>
              draw date: {formatDate(draw_date)}
            </Badge>
          )}
          {gametype && (
            <Badge variant={"secondary"}>gametype: {gametype}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="animate-spin h-4 w-4" />
          </div>
        ) : (
          <>
            <WinningOrderByAgentCell data={data} />
            <WinningOrderSheetModal isOpen={open} setOpen={setOpen} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function WinningOrderByAgentCell({ data }: { data: ReduceWinningOrderType[] }) {
  const [select, setSelect] = useState<string | null>(null);
  return data.map((ele) => (
    <div
      key={ele.id}
      className={cn(
        "flex items-center justify-between border-l-4 rounded px-4 py-3 mb-2 shadow select-none transition-all hover:bg-accent/40 hover:translate-x-1",
        select === ele.id && "border-primary"
      )}
      onClick={() => setSelect(ele.id)}
    >
      <div className="grid">
        <span className="font-normal text-sm">{ele.username}</span>
        <span className="text-sm">{ele.email}</span>
      </div>
      <div className="grid gap-2 w-[200px]">
        <div className="text-xs font-medium">
          Claimed : RM {ele.total_claimed.toFixed(2)} /{" "}
          {ele.total_payout.toFixed(2)}
        </div>
        <Progress
          value={(ele.total_claimed / ele.total_payout) * 100}
          className="h-1"
        />
      </div>
    </div>
  ));
}

interface WinningOrderSheetModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
function WinningOrderSheetModal({
  isOpen,
  setOpen,
}: WinningOrderSheetModalProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-[860px]"></SheetContent>
    </Sheet>
  );
}
function UITest() {
  const [select, setSelect] = useState<string | null>(null);
  const test = Array.from({ length: 6 }, (_, i) => ({
    id: `test-item-${i + 1}`,
    username: "username",
    email: "email details",
    total_payout: 1000,
    total_claimed: 250,
  }));
  return test.map((ele) => (
    <div
      key={ele.id}
      className={cn(
        "flex items-center justify-between border-l-4 rounded px-4 py-3 mb-2 shadow select-none transition-all hover:bg-accent/40 hover:translate-x-1",
        select === ele.id && "border-primary"
      )}
      onClick={() => setSelect(ele.id)}
    >
      <div className="grid">
        <span className="font-normal text-sm">{ele.username}</span>
        <span className="text-sm">{ele.email}</span>
      </div>
      <div className="grid gap-2 w-[200px]">
        <div className="text-xs font-medium">
          Claimed : RM {ele.total_claimed.toFixed(2)} /{" "}
          {ele.total_payout.toFixed(2)}
        </div>
        <Progress
          value={(ele.total_claimed / ele.total_payout) * 100}
          className="h-1"
        />
      </div>
    </div>
  ));
}
