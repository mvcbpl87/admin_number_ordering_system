type Agent = {
  id: string;
  tier: string;
  commissionRate: number;
  downline: Agent[];
};

const calculateTotalSales = (user_id: string, sales: AllSales[]) => {
  var totalSales = 0;
  const salesByUser = sales.filter((item) => item.user_id === user_id);
  if (salesByUser.length !== 0) {
    totalSales = salesByUser.reduce((accumulator, current) => {
      const { ticket_numbers } = current;
      const { number, category, amount } = ticket_numbers!;
      const pivot = number.length * amount * category.length;
      return (accumulator += pivot);
    }, 0);
  }
  return totalSales;
};
export function calculateCommission(
  agent: Agent,
  sales: AllSales[],
  baseCommission: number = 0
): number {
  let directCommission =
    agent.commissionRate * calculateTotalSales(agent.id, sales);

  let downlineCommission = agent.downline.reduce((acc, downlineAgent) => {
    let downlineRate = (agent.commissionRate - downlineAgent.commissionRate)*10;
    console.log("allocated", downlineRate);
    console.log( 'this', calculateCommission(downlineAgent, sales), downlineRate * calculateCommission(downlineAgent, sales))
    return acc + downlineRate* calculateCommission(downlineAgent, sales, baseCommission);
  }, 0);
  console.log(`Summary ${agent.tier}`, directCommission, downlineCommission);
  return directCommission + downlineCommission;
}
