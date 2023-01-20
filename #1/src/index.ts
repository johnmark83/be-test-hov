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

    let aggregateFunction = {
      "AccountCreated": () => {
        if (curr.aggregateId !== accountId) return;
        acc = {
          email: curr.body.email ?? "",
          fullName: curr.body.fullName ?? "",
          password: curr.body.password ?? "",
          username: curr.body.username ?? "",
          totalApprovedDepositAmount: 0,
          totalApprovedWithdrawalAmount: 0
        };
      },
      "AccountUpdated": () => {
        if (acc === null || curr.aggregateId !== accountId) return;
        Object.keys(curr.body).forEach(key => {
          acc![key] = curr.body[key];
        });
      },
      "WithdrawalCreated": () => {
        withdrawalsCreated.push(curr);
      },
      "DepositCreated": () => {
        depositsCreated.push(curr);
      },
      "WithdrawalApproved": () => {
        const withdrawalCreated: Event | undefined = withdrawalsCreated.find(withdrawal => withdrawal.aggregateId === curr.aggregateId);
        if (withdrawalCreated && acc) acc.totalApprovedWithdrawalAmount += withdrawalCreated.body.amount ?? 0;
      },
      "DepositApproved": () => {
        const depositCreated: Event | undefined = depositsCreated.find(deposit => deposit.aggregateId === curr.aggregateId);
        if (depositCreated && acc) acc.totalApprovedDepositAmount += depositCreated.body.amount ?? 0;
      }
    }

    if (aggregateFunction[curr.type]) aggregateFunction[curr.type]();

    return acc;

  }, null);

  return accountInformation;
}