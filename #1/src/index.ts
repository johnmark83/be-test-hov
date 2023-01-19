import { AccountEvents } from '../../events';

export function calculateAccountBalance(events: typeof AccountEvents, accountId: string): number {
  const totalCredit = events.reduce((acc, curr) => {
    if (curr.aggregateId === accountId && curr.type === "BalanceCredited") return acc += curr.body.amount ?? 0;
    return acc;
  }, 0);

  const totalDebit = events.reduce((acc, curr) => {
    if (curr.aggregateId === accountId && curr.type === "BalanceDebited") return acc += curr.body.amount ?? 0;
    return acc;
  }, 0);

  return totalCredit - totalDebit;
}

export function getAccountInformation(events: typeof AccountEvents, accountId: string) {
  return {};
}