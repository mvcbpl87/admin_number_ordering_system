/**
 * Hooks for Report UI to correlated with each and follows the correct flows during
 * filtering allSales
 */
export const FilterDrawDateAndUserId = (
  sales: AllSales[],
  user_id: string,
  draw_date: string
): AllSales[] => {
  return sales.filter(
    (item) =>
      item.ticket_numbers &&
      item.ticket_numbers.draw_date === draw_date &&
      item.user_id === user_id
  );
};
export const FilterCategory = (
  sales: AllSales[],
  category: string
): AllSales[] => {
  return category === "all"
    ? sales
    : sales.filter(
        (item) =>
          item.ticket_numbers && item.ticket_numbers.category.includes(category)
      );
};

export const FilterGametype = (
  sales: AllSales[],
  gametype: string
): AllSales[] => {
  return sales.filter(
    (item) => item.ticket_numbers && item.ticket_numbers.gametype === gametype
  );
};

export const FilterDrawDate = (
  sales: AllSales[],
  draw_date: string
): AllSales[] => {
  return sales.filter(
    (item) => item.ticket_numbers && item.ticket_numbers.draw_date === draw_date
  );
};

/* (Utils) Summations of values [sales_amount] depends on category return total_sales_amount */
export const TotalSales = (
  sales: AllSales[],
  d_category?: string | undefined
): number => {
  return sales.reduce((sum, item) => {
    let pivot = 0;
    if (item.ticket_numbers) {
      const { number, amount, category } = item.ticket_numbers;
      const EQ = number.length * amount;
      const EQ2 = number.length * amount * category.length;
      pivot = d_category !== "all" || !d_category ? EQ : EQ2;
    }
    return (sum += pivot);
  }, 0);
};

/**
 * (Utils) For CustomerOrderDetails Grouping metadata by receipt_id, contacts, big, small, value
 *
 * returns Tickets[] where, item => {receipt_id, contacts,big, small, value}[]
 * { [key: string]: AllSales[] } => {}
 */
type ReduceInstance = {
  receipt_id: string;
  phone_number: string;
  ticket_numbers: TicketNumbers[];
};
export const GroupingCustomerOrder = (sales: AllSales[]) => {
  return sales.reduce((groups: ReduceInstance[], data) => {
    const { receipt_id, phone_number } = data;

    var orders = [...groups];
    const current = orders.find((item) => item.receipt_id === receipt_id);

    if (current) {
      current["ticket_numbers"].push(data.ticket_numbers!);
      orders[orders.findIndex((item) => item.receipt_id === receipt_id)] =
        current;
    } else {
      orders.push({
        receipt_id,
        phone_number,
        ticket_numbers: [data.ticket_numbers!],
      });
    }

    return orders;
  }, []);
};
