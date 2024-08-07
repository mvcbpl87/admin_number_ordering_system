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

function calculateDownlineCommission(
  agent: Agent,
  sales: AllSales[],
  baseCommission: number = 0,
  parentComm: number = 0
): number {
  const _func = agent.downline.reduce((sum, downline) => {
    const downlineRate = baseCommission - downline.commissionRate;
    let childComm = 0;
    // let downlineRate = 0;

    if (downline.downline.length !== 0) {
      childComm = calculateDownlineCommission(
        downline,
        sales,
        baseCommission,
        downline.commissionRate
      );
    }
    const pivot =
      downlineRate * calculateTotalSales(downline.id, sales) + childComm;
    // console.log(
    //   `Downline rate: ${agent.tier} & ${downline.tier}:`,
    //   calculateTotalSales(downline.id, sales),
    //   downlineRate * calculateTotalSales(downline.id, sales),
    //   calculateDownlineCommission(downline, sales, baseCommission)
    // );
    return (sum += pivot);
  }, 0);
  console.log(`Tier${agent.tier} :`, _func);
  return _func;
}
export function calculateCommission(
  agent: Agent,
  sales: AllSales[],
  baseCommission: number = 0
): number {
  let directCommission =
    agent.commissionRate * calculateTotalSales(agent.id, sales);
  // console.log(`Direct_comm ${agent.tier} :`, directCommission);
  // let downlineCommission = agent.downline.reduce((acc, downlineAgent) => {
  //   let downlineRate = baseCommission - downlineAgent.commissionRate;
  //   console.log(
  //     `This-tier${agent.tier} from ${downlineAgent.tier}:`,
  //     calculateCommission(downlineAgent, sales, downlineAgent.commissionRate)
  //   );
  //   return (acc += calculateCommission(
  //     downlineAgent,
  //     sales,
  //     downlineAgent.commissionRate
  //   ));
  // }, 0);
  let downlineCommission = calculateDownlineCommission(
    agent,
    sales,
    agent.commissionRate
  );
  return directCommission + downlineCommission;
}

// export function calculateCommission(
//   agent: Agent,
//   sales: AllSales[],
//   baseCommission: number = 0
// ): number {
//   let directCommission =
//     agent.commissionRate * calculateTotalSales(agent.id, sales);

//   let downlineCommission = agent.downline.reduce((acc, downlineAgent) => {
//     let downlineRate = (agent.commissionRate - downlineAgent.commissionRate)*10;
//     console.log("allocated", downlineRate);
//     console.log( 'this', calculateCommission(downlineAgent, sales), downlineRate * calculateCommission(downlineAgent, sales))
//     return acc + downlineRate* calculateCommission(downlineAgent, sales, baseCommission);
//   }, 0);
//   console.log(`Summary ${agent.tier}`, directCommission, downlineCommission);
//   return directCommission + downlineCommission;
// }
