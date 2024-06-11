"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CategoryList } from "@/lib/types";
import { cn } from "@/lib/utils";
import { IconTrophy } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/shared/DatePicker";
import { IconImage } from "@/components/shared/IconImgTemplate";
import SoldOutTable from "./sold-out-table";
import { PlusCircle } from "lucide-react";
import { useModal } from "@/components/provider/modal-provider";
import { CustomModal } from "@/components/shared/custom-modal";
import SoldOutNumberForm from "@/components/form/sold-out-number-form";

export default function SoldOutUI() {
  const modal = useModal();
  const [currCategory, setCurrCategory] = useState<string | null>(null);
  const [data, setData] = useState<SoldOutNumbers[]>([]);
  const [date, setDate] = useState<Date>();

  const viewSoldOutForm = () => {
    const create_fn = (data:SoldOutNumbers[]) =>{
      setData(prev =>([...prev, ...data]))
    } 
    modal.setOpen(
      <CustomModal title="Sold out number" subheading="Add new sold out number">
        <SoldOutNumberForm params={null} clientClick={create_fn}/>
      </CustomModal>
    );
  };
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
          <DatePicker date={date} setDate={setDate} />
        </div>
        <Button
          size={"sm"}
          className="flex items-center gap-2"
          onClick={viewSoldOutForm}
        >
          <PlusCircle size={15} />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Set new sold out number
          </span>
        </Button>
      </div>
      <SoldOutTable
        category={currCategory}
        drawDate={date}
        data={data}
        setData={setData}
      />
    </div>
  );
}
