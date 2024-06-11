import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import SoldOutTable from "./components/sold-out-table";
import SoldOutUI from "./components/soldOut-ui";

export default function SoldOutNumbersPage() {
  return (
    <div className="flex flex-col flex-1 flex-grow gap-2 bg-muted/40 p-4  md:p-10">
      <SoldOutUI/>
    </div>
  );
}
