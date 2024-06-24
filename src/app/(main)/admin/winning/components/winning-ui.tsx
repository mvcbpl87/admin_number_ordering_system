"use client";
import { CategoryList } from "@/lib/types";
import { useState } from "react";
import WinningTable from "./winning-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/shared/DatePicker";
import { IconImage } from "@/components/shared/IconImgTemplate";
import WinningNumber from "./winning-number";

export default function WinningUI() {
  const [winningNumbers, setWinningNumbers] = useState<WinningNumbersWPrize[]>(
    []
  );
  // const [items, setItems] = useState<WinningNumbersWPrize[]>([]);
  const [currCategory, setCurrCategory] = useState<string | null>(null);
  const [gametype, setGametype] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();

  return (
    <div className="  flex flex-col flex-grow space-y-[1rem]">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2">
          {/* --- Set Shop Category --- */}
          <Select
            onValueChange={setCurrCategory}
            defaultValue={!currCategory ? "" : currCategory}
          >
            <SelectTrigger className="w-[200px] bg-background">
              <SelectValue placeholder="Select shop category" />
            </SelectTrigger>
            <SelectContent>
              {CategoryList.map((category) => (
                <SelectItem
                  value={category.name}
                  key={category.name}
                  onClick={() => setCurrCategory(category.name)}
                >
                  <div className="flex items-center gap-2 py-2">
                    <IconImage src={category.src} alt={category.alt} />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* --- Set Gametype --- */}
          <Select
            onValueChange={setGametype}
            defaultValue={!gametype ? "" : gametype}
          >
            <SelectTrigger className="w-[120px] bg-background">
              <SelectValue placeholder="Gametype" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Big">Big</SelectItem>
              <SelectItem value="Small">Small</SelectItem>
            </SelectContent>
          </Select>
          <DatePicker date={date} setDate={setDate} />
        </div>
      </div>
      <WinningNumber
        winningNumbers={winningNumbers}
        setWinningNumbers={setWinningNumbers}
        category={currCategory}
        gametype={gametype}
        drawDate={date}
      />
      <WinningTable
        winning_number={winningNumbers}
        category={currCategory}
        gametype={gametype}
        drawDate={date}
      />
    </div>
  );
}
