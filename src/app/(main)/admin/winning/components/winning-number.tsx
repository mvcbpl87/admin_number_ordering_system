import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DeleteWinningOrders,
  RetrieveWinningNumbers,
  UpdateWinningNumbers,
} from "@/server-actions";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface WinningNumberProps {
  category: string | null;
  gametype: string | null;
  drawDate: Date | undefined;
  winningNumbers: WinningNumbersWPrize[];
  setWinningNumbers: React.Dispatch<
    React.SetStateAction<WinningNumbersWPrize[]>
  >;
}

export default function WinningNumber({
  setWinningNumbers,
  category,
  gametype,
  drawDate,
}: WinningNumberProps) {
  const [items, setItems] = useState<WinningNumbersWPrize[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  const fetchWinningNumber = async () => {
    if (!category || !gametype || !drawDate) return;
    try {
      setIsLoading(true);
      const winning_number = await RetrieveWinningNumbers(
        category,
        gametype,
        formatDate(drawDate)
      );

      if (winning_number) setItems(winning_number);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWinningNumber();
  }, [category, gametype, drawDate]);

  const handleEdit = (
    e: React.ChangeEvent<HTMLInputElement>,
    item: WinningNumbersWPrize
  ) => {
    if (Array.from(e.target.value).length > 4) return;
    if (Number(e.target.value) < -1) return;
    if (!isNaN(Number(e.target.value))) {
      setItems((prev) => {
        const existingItems = [...prev];
        var current = existingItems.find((currItem) => currItem.id === item.id);
        var index = existingItems.findIndex(
          (currItem) => currItem.id === item.id
        );
        if (!current) return existingItems;
        current["number"] = [Number(e.target.value)];
        existingItems[index] = current;

        return existingItems;
      });
    }
  };
  const handleEditSecondary = (
    e: React.ChangeEvent<HTMLInputElement>,
    numIndex: number,
    item: WinningNumbersWPrize
  ) => {
    if (Array.from(e.target.value).length > 4) return;
    if (Number(e.target.value) < -1) return;
    if (!isNaN(Number(e.target.value))) {
      setItems((prev) => {
        const existingItems = [...prev];
        var ItemIndex = existingItems.findIndex(
          (currItem) => currItem.id === item.id
        );
        existingItems[ItemIndex].number[numIndex] = Number(e.target.value);
        return existingItems;
      });
    }
  };
  const handleSave = async () => {
    if (!category || !gametype || !drawDate) return;
    try {
      setIsSaving(true);
      const params: WinningNumbers[] = items.map((item) => ({
        id: item.id,
        number: item.number,
        gametype: item.gametype,
        category: item.category,
        prize_id: item.prizes.id,
        draw_date: item.draw_date,
        created_at: item.draw_date,
      }));
      await UpdateWinningNumbers(params);
      await DeleteWinningOrders(formatDate(drawDate));
      setWinningNumbers((prev) => (prev = items));
      toast({
        variant: "successful",
        title: "Successfully update winning number",
        description: `You have successfully updating winning number`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${err}`,
      });
    } finally {
      setIsSaving(false);
      setIsEdit(!isEdit);
    }
  };
  return (
    <AlertDialog>
      <Card className="h-[500px] xl:col-span-2">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Winning Number</CardTitle>
            <CardDescription>
              Set winning number for main prize, special and consolation
            </CardDescription>
          </div>
          {!isEdit ? (
            <Button
              size="sm"
              className="ml-auto gap-1 flex items-center"
              onClick={() => setIsEdit(!isEdit)}
              disabled={!category || !gametype || !drawDate}
            >
              <span>Set Winning Number</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          ) : (
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                className="ml-auto gap-1 flex items-center bg-green-400 text-green-900"
                variant={"ghost"}
              >
                <span>Save winning number</span>
                {isSaving ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Main">
            <TabsList>
              {["Main", "Special", "Consolation"].map((trigger, index) => (
                <TabsTrigger
                  key={`trigger-winning-${index + 1}`}
                  value={trigger}
                >
                  {trigger}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="Main">
              <MainPrize
                isLoading={isLoading}
                isEdit={isEdit}
                handleEdit={handleEdit}
                data={items.filter(
                  (item) =>
                    item.prizes.prize_type !== "Special" &&
                    item.prizes.prize_type !== "Consolation"
                )}
              />
            </TabsContent>
            <TabsContent value="Special">
              <SecondaryPrize
                isEdit={isEdit}
                handleEdit={handleEditSecondary}
                data={items.find(
                  (item) => item.prizes.prize_type === "Special"
                )}
              />
            </TabsContent>
            <TabsContent value="Consolation">
              <SecondaryPrize
                isEdit={isEdit}
                handleEdit={handleEditSecondary}
                data={items.find(
                  (item) => item.prizes.prize_type === "Consolation"
                )}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you wish to save this winning number?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action only can be done by admin and must adhere rules of play.
            This also will determine winners based on their bought ticket,
            gametype, draw date and shop categories.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type MainPrizeProps = {
  data: WinningNumbersWPrize[];
  isEdit: boolean;
  handleEdit: (
    event: React.ChangeEvent<HTMLInputElement>,
    item: WinningNumbersWPrize
  ) => void;
  isLoading: boolean;
};
function MainPrize({ data, isEdit, handleEdit, isLoading }: MainPrizeProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Prize</TableHead>
          <TableHead className="w-[200px]">Number</TableHead>
          <TableHead>Gametype</TableHead>
          <TableHead>Draw date</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 ">
              <div className=" flex items-center justify-center">
                <Loader2 className="animate-spin" />
              </div>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className=" text-center">
              No results.
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.prizes.prize_type}
              </TableCell>

              <TableCell className="">
                {isEdit ? (
                  <Input
                    value={item.number[0]}
                    onChange={(e) => handleEdit(e, item)}
                  />
                ) : (
                  item.number[0]
                )}
              </TableCell>
              <TableCell>{item.gametype}</TableCell>
              <TableCell>{item.draw_date}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="text-right font-medium">
                RM{item.prizes.prize_value.toFixed(2)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

type SecondaryPrizeProps = {
  data: WinningNumbersWPrize | undefined;
  isEdit: boolean;
  handleEdit: (
    event: React.ChangeEvent<HTMLInputElement>,
    numIndex: number,
    item: WinningNumbersWPrize
  ) => void;
};
function SecondaryPrize({ data, isEdit, handleEdit }: SecondaryPrizeProps) {
  return (
    <div className="space-y-[1rem]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prize</TableHead>
            <TableHead>Gametype</TableHead>
            <TableHead>Draw date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data ? (
            <TableRow>
              <TableCell colSpan={6} className=" text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            <TableRow key={data.id}>
              <TableCell className="font-medium">
                {data.prizes.prize_type}
              </TableCell>
              <TableCell>{data.gametype}</TableCell>
              <TableCell>{data.draw_date}</TableCell>
              <TableCell>{data.category}</TableCell>
              <TableCell className="text-right font-medium">
                RM{data.prizes.prize_value.toFixed(2)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-center px-3">
        <Badge variant={"secondary"}>Number</Badge>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {data &&
          data.number.map((item, index) => {
            if (isEdit)
              return (
                <Input
                  key={`${data.prizes.prize_type}Input-${index + 1}`}
                  value={item}
                  onChange={(e) => handleEdit(e, index, data)}
                  className="text-center h-9"
                />
              );
            return (
              <div
                className="border bg-muted/50 rounded-lg p-2 text-center text-sm h-9"
                key={`${data.prizes.prize_type}-${index + 1}`}
              >
                {item}
              </div>
            );
          })}
      </div>
    </div>
  );
}
