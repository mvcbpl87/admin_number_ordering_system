import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HTMLAttributes } from "react";
interface CardSalesProps extends HTMLAttributes<HTMLDivElement> {
    type: string;
    title: string;
    icon: React.ElementType;
    value: number | null;
    descriptions: string;
  }
  
  export function CardSales({
    className,
    type,
    title,
    icon: Icon,
    value,
    descriptions,
  }: CardSalesProps) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {type == "currency" ? `RM${!value ? 0 : value}` : value}
          </div>
          <p className="text-xs text-muted-foreground">{descriptions}</p>
        </CardContent>
      </Card>
    );
  }
  