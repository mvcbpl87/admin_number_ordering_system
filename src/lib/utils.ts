import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 2).toISOString();
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString();
}

// Format Date into standard prefixes
export const formatDate = (date: Date) => {
  const f = new Intl.DateTimeFormat("en-us", { dateStyle: "medium" });
  return f.format(date);
};

export const formatTime = (time: Date) => {
  const f = new Intl.DateTimeFormat("en-us", { timeStyle: "medium" });
  return f.format(time);
};

export const NumberFormater = (value: string) => {
  if (Number(value) < 10) return `000${value}`;
  if (Number(value) < 100) return `00${value}`;
  if (Number(value) < 1000) return `0${value}`;
  return value;
};

export function ISOTimeFormater(date:string){
  return new Date(date).toISOString().slice(0,10);
}

export function WeekTimeFrame() {
  let curr = new Date();
  let week = [];

  for (let i = 1; i <= 7; i++) {
    let first = curr.getDate() - curr.getDay() + i;
    let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
    week.push(day);
  }
  return week;
}

export function DailyTimeFrame(){
  return new Date().toISOString().slice(0, 10);
}
