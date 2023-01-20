import waitForExpect from 'wait-for-expect';

import AccountProjection from '../../src/projection/account';

import { AccountEvents, AggregateType } from '../../../events';
import EventStore from '../../src/library/eventstore';
import { expect } from 'chai';
import { collections, connectToDatabase } from '../../src/services/database';
import { ObjectId } from 'mongodb';
import { AccountModel } from '../../src/models/AccountModel';

async function findById(id: string): Promise<{
  username: string;
  fullName: string;
  email: string;
  balance: number;
  totalApprovedDepositAmount: number;
  totalApprovedWithdrawalAmount: number;
} | null> {

  try {
    const query = { aggregateId: id };
    const account = (await collections.accounts?.findOne(query)) as AccountModel | null | undefined;

    if (account) return {
      username: account.username,
      fullName: account.fullName,
      email: account.email,
      balance: account.balance,
      totalApprovedDepositAmount: account.totalApprovedDepositAmount,
      totalApprovedWithdrawalAmount: account.totalApprovedWithdrawalAmount
    };
  } catch (error) {
    console.error(`Unable to find matching document with id: ${id}`);
  }
  return null;
}

describe('AccountProjection', function () {
  describe('#start', function () {
    before(async function () {
      await connectToDatabase();
      this.eventStore = new EventStore(AccountEvents);
      this.projection = new AccountProjection(this.eventStore);
      this.aggregateId = '60329145-ba86-44fb-8fc8-519e1e427a60';

      await this.projection.start();

      this.account = await findById(this.aggregateId);
    });

    after(async function () {
      await collections.depositsCreated?.deleteMany({});
      await collections.withdrawalsCreated?.deleteMany({});
      await collections.accounts?.deleteMany({});
    });

    it('SHOULD project the data to the correctly to the database', function () {
      expect(this.account).to.deep.equal({
        username: 'jdoe',
        fullName: 'johndoe',
        email: 'email@ml.com',
        balance: 23,
        totalApprovedWithdrawalAmount: 7,
        totalApprovedDepositAmount: 10,
      });
    });

    describe('WHEN there is a new event', function () {
      before(async function () {
        await this.eventStore.createEvent({
          aggregateType: AggregateType.Account,
          type: 'BalanceDebited',
          aggregateId: this.aggregateId,
          body: { amount: 7 },
        });
      });

      it('SHOULD be able to apply new events to the model', async function () {
        await waitForExpect(async () => {
          const account = await findById(this.aggregateId);
          expect(account).to.have.property('balance', 16);
        });
      });
    });
  });
});
