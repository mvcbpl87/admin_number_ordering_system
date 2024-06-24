import { NumberFormater } from "@/lib/utils";
import { SalesColumnType } from "./columns";

// export default function PresetSalesData() {
//   return Array.from({ length: 1000 }, (_, idx) => ({
//     number: NumberFormater(`${idx}`),
//     total_big:Math.floor(Math.random()*1000),
//     total_small: Math.floor(Math.random()*1000),
//     total_value:Math.floor(Math.random()*1000) ,
//   })) as SalesColumnType[];
// }

export default function PresetSalesData() {
  return Array.from({ length: 10000 }, (_, idx) => ({
    number: NumberFormater(`${idx}`),
    total_big: 0,
    total_small: 0,
    total_value: 0,
  })) as SalesColumnType[];
}
