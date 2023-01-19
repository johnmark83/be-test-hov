import { AccountEvents, AggregateType } from '../../events';
import { Event } from './types';

export function calculateAccountBalance(events: typeof AccountEvents, accountId: string): number {

  const totalBalance: number = events.reduce((acc: number, curr: Event) => {
    if (accountId !== curr.aggregateId) return acc;

    if (curr.type === "BalanceCredited") {
      acc += curr.body.amount ?? 0;
    }

    if (curr.type === "BalanceDebited") {
      acc -= curr.body.amount ?? 0;
    }

    return acc;
  }, 0);

  return totalBalance;
}

export function getAccountInformation(events: typeof AccountEvents, accountId: string) {
  return {};
}