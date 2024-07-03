type Sale = {
    amount: number;
    tier: number;
};

export type Agent = {
    name: string;
    tier: number;
    commissionRate: number;
    allocatedRate: number;
    sales: Sale[];
    downline: Agent[];
};

export function calculateCommission(agent: Agent, baseCommissionRate: number = 0): number {
    // Calculate commission for direct sales
    let directCommission = agent.sales.reduce((acc, sale) => acc + (agent.commissionRate * sale.amount), 0);

    // Calculate commission from downline sales
    let downlineCommission = agent.downline.reduce((acc, downlineAgent) => {
        // Calculate the commission rate the agent gets from their downline
        let downlineRate = baseCommissionRate - agent.allocatedRate;

        // Add the commission earned from the downline's sales
        return acc + (downlineRate * calculateCommission(downlineAgent, agent.allocatedRate));
    }, 0);

    // Total commission is the sum of direct sales commission and downline commission
    return directCommission + downlineCommission;
}

