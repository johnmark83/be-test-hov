import { AccountEvents } from '../../events';
import { AccountInformation, Event } from './types';

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
  let depositsCreated: Array<Event> = new Array<Event>();
  let withdrawalsCreated: Array<Event> = new Array<Event>();

  const accountInformation: AccountInformation | null = events.reduce((acc: AccountInformation | null, curr: Event) => {
    switch (curr.type) {
      case "AccountCreated":
        if (curr.aggregateId !== accountId) break;
        acc = ((body) => (
          {
            ...body,
            totalApprovedDepositAmount: 0,
            totalApprovedWithdrawalAmount: 0
          } as AccountInformation)
        )(curr.body);
        break;
      case "AccountUpdated":
        if (acc === null || curr.aggregateId !== accountId) break;
        Object.keys(curr.body).forEach(key => {
          acc![key] = curr.body[key];
        });
        break;
      case "WithdrawalCreated":
        withdrawalsCreated.push(curr);
        break;
      case "DepositCreated":
        depositsCreated.push(curr);
        break;
      case "WithdrawalApproved":
        const withdrawalCreated: Event | undefined = withdrawalsCreated.find(withdrawal => withdrawal.aggregateId === curr.aggregateId);
        if (withdrawalCreated && withdrawalCreated.body.amount && acc) acc.totalApprovedWithdrawalAmount += withdrawalCreated.body.amount ?? 0;
        break;
      case "DepositApproved":
        const depositCreated: Event | undefined = depositsCreated.find(deposit => deposit.aggregateId === curr.aggregateId);
        if (depositCreated && depositCreated.body.amount && acc) acc.totalApprovedDepositAmount += depositCreated.body.amount ?? 0;
        break;
      default:
        break;
    }

    return acc;
  }, null);
  return accountInformation;
}