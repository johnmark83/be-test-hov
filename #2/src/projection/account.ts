import { AggregateType, Event } from '../../../events';
import EventStore from '../library/eventstore';
import Projection from '../library/projection';
import { AccountModel } from '../models/AccountModel';
import { DepositCreatedModel } from '../models/DepositCreatedModel';
import { WithdrawalCreatedModel } from '../models/WithdrawalCreatedModel';
import { collections } from '../services/database';

export default class AccountProjection extends Projection {
  public constructor(eventStore: EventStore) {
    super(
      eventStore,
      [
        { aggregateType: AggregateType.Account },
        { aggregateType: AggregateType.Deposit },
        { aggregateType: AggregateType.Withdrawal },
      ],
    );
  }

  protected async apply(event: Event) {
    const query = { aggregateId: event.aggregateId };

    let aggregateFunction = {
      "AccountCreated": async () => {
        try {
          const newAccount: AccountModel = {
            aggregateId: event.aggregateId,
            email: event.body.email ?? "",
            fullName: event.body.fullName ?? "",
            password: event.body.password ?? "",
            username: event.body.username ?? "",
            totalApprovedDepositAmount: 0,
            totalApprovedWithdrawalAmount: 0,
            balance: 0
          };

          await collections.accounts?.insertOne(newAccount);
        } catch (error) {
          console.error(error);
        }
      },
      "AccountUpdated": async () => {
        try {
          await collections.accounts?.findOneAndUpdate(query, { $set: event.body });
        } catch (error) {
          console.error(error);
        }
      },
      "WithdrawalCreated": async () => {
        try {
          await collections.withdrawalsCreated?.insertOne(event);
        } catch (error) {
          console.error(error);
        }
      },
      "DepositCreated": async () => {
        try {
          await collections.depositsCreated?.insertOne(event);
        } catch (error) {
          console.error(error);
        }
      },
      "WithdrawalApproved": async () => {
        try {
          const withdrawalCreated = (await collections.withdrawalsCreated?.findOne(query)) as WithdrawalCreatedModel | undefined | null;

          if (withdrawalCreated) {
            await collections.accounts?.updateOne(
              { aggregateId: withdrawalCreated.body.account },
              { $inc: { totalApprovedWithdrawalAmount: withdrawalCreated.body.amount } });
          }
        } catch (error) {
          console.error(error);
        } finally {
          await collections.withdrawalsCreated?.deleteOne(query);
        }
      },
      "DepositApproved": async () => {
        try {
          const depositCreated = (await collections.depositsCreated?.findOne(query)) as DepositCreatedModel | undefined | null;

          if (depositCreated) {
            await collections.accounts?.updateOne(
              { aggregateId: depositCreated.body.account },
              { $inc: { totalApprovedDepositAmount: depositCreated.body.amount } });
          }
        } catch (error) {
          console.error(error);
        } finally {
          await collections.depositsCreated?.deleteOne(query);
        }
      },
      "BalanceCredited": async () => {
        try {
          await collections.accounts?.updateOne(query, { $inc: { balance: event.body.amount } });
        } catch (error) {
          console.error(error);
        }
      },
      "BalanceDebited": async () => {
        try {
          await collections.accounts?.updateOne(query, { $inc: { balance: -(event.body.amount) } });
        } catch (error) {
          console.error(error);
        }
      },
    }

    if (aggregateFunction[event.type]) await aggregateFunction[event.type]();
  }
}