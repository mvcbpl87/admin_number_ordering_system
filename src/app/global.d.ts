import { Database as DB } from "../../schema/database.types";

declare global {
  type Database = DB;
  type Users = Database["public"]["Tables"]["users"]["Row"];
  type CustomerOrders = Database["public"]["Tables"]["customer_orders"]["Row"];
  type TicketNumbers = Database["public"]["Tables"]["ticket_numbers"]["Row"];
  type Prizes = Database["public"]["Tables"]["prizes"]["Row"];
  type WinningNumbers = Database["public"]["Tables"]["winning_numbers"]["Row"];
  type WinningOrders = Database["public"]["Tables"]["winning_orders"]["Row"];
  type SoldOutNumbers = Database["public"]["Tables"]["sold_out_number"]["Row"];
  type TicketBought = Database["public"]["Tables"]["ticket_bought"]["Row"];
  type Commission = Database["public"]["Tables"]["commission"]["Row"];
  type RootCommission = Database["public"]["Tables"]["root_commission"]["Row"];
  type Credits = Database["public"]["Tables"]["credits"]['Row'];

  /* ----- Custom Type Exports ----- */
  type UsersWCommissionCredits = Users & {
    commission: Commission | null;
    credits: Credits | null;
  };
  type WinningNumbersWPrize = WinningNumbers & {
    prizes: Prizes;
  };
  type WinningOrdersWCredentials = WinningOrders & {
    customer_orders: {
      id: CustomerOrders["id"];
      phone_number: CustomerOrders["phone_number"];
      users: {
        id: Users["id"];
        username: Users["username"];
        email: Users["email"];
      } | null;
    } | null;
    prizes: {
      prize_type: Prizes["prize_type"];
      prize_value: Prizes["prize_value"];
    } | null;
  };
  type NewTicketNumbers = Partial<
    Database["public"]["Tables"]["ticket_numbers"]["Row"]
  >;
  type AllSales = CustomerOrders & {
    ticket_numbers: TicketNumbers | null;
  };
  type AllSubAccounts = {
    id: Users["id"];
    username: Users["username"];
    email: Users["email"];
    role: Users["role"];
  }[];
}
