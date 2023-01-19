import { AccountEvents } from '../../events';

function _isIdAndTypeEqual(id: string, type: string, itemId: string, itemType: string) {
  return id === itemId && type === itemType;
}

export function calculateAccountBalance(events: typeof AccountEvents, accountId: string): number {
  const totalCredit: number = events.reduce((acc, curr) => {
    if (_isIdAndTypeEqual(accountId, "BalanceCredited", curr.aggregateId, curr.type)) return acc += curr.body.amount ?? 0;

    return acc;
  }, 0);

  const totalDebit: number = events.reduce((acc, curr) => {
    if (_isIdAndTypeEqual(accountId, "BalanceDebited", curr.aggregateId, curr.type)) return acc += curr.body.amount ?? 0;

    return acc;
  }, 0);

  return totalCredit - totalDebit;
}

export function getAccountInformation(events: typeof AccountEvents, accountId: string) {

  return {};
}