import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import SalesInterface from "./components";
export default function SalesPage() {
  return (
    <div className="flex flex-col flex-1 flex-grow gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <Card className="flex flex-col flex-grow">
        <CardHeader>
          <div className="grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Ticket Sales</h1>
            <p className="text-muted-foreground">
              Ticket Sales activities.
            </p>
          </div>
          <CardContent className="p-0 flex flex-grow">
            <SalesInterface/>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
