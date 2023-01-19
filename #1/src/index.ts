import { AccountEvents } from '../../events';

export function calculateAccountBalance(events: typeof AccountEvents, accountId: string): number {

  const totalBalance: number = events.reduce((acc, curr) => {
    if (accountId !== curr.aggregateId) return acc;

    switch (curr.type) {
      case "BalanceCredited":
        acc += curr.body.amount ?? 0;
        break;
      case "BalanceDebited":
        acc -= curr.body.amount ?? 0;
        break;
      default:
        break;
    }

    return acc;
  }, 0);

  return totalBalance;
}

export function getAccountInformation(events: typeof AccountEvents, accountId: string) {

  return {};
}