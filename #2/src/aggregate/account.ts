import { AccountCreatedEvent, AccountUpdatedEvent, AggregateType, CreditedEvent, DebitEvent } from '../../../events';
import EventStore from '../library/eventstore';
import Aggregate from '../library/aggregate';
import { AccountAlreadyExistsError, AccountNotFoundError, InsufficientFundError } from '../library/errors';

export type Account = {
  username: string;
  fullName: string;
  password: string;
  email: string;
  balance: number;
};

export type AccountState = Account | null;

type AccountAggregateEvents = AccountCreatedEvent | AccountUpdatedEvent | CreditedEvent | DebitEvent;

export default class AccountAggregate extends Aggregate<AccountState> {

  public static findById(id: string, eventStore: EventStore): AccountAggregate {
    const account = new AccountAggregate(id, eventStore);
    account.fold();
    return account;
  }

  public get aggregateType() {
    return AggregateType.Account;
  }

  constructor(id: string, eventStore: EventStore) {
    super(id, null, eventStore);
  }

  /**
   * This method will be called for each event that will be processed by the aggregate
   * that is from the eventstore.
   * @param event 
   * @returns 
   */
  protected apply(event: AccountAggregateEvents): AccountState {

    let aggregateFunction = {
      "AccountCreated": () => {
        this._state = (body => (
          { ...body, balance: 0 } as AccountState)
        )((event as AccountCreatedEvent).body);
      },
      "AccountUpdated": () => {
        Object.keys(event.body).forEach(key => {
          this._state![key] = (event as AccountUpdatedEvent).body[key];
        });
      },
      "BalanceCredited": () => {
        this._state!.balance += (event as CreditedEvent).body.amount;
      },
      "BalanceDebited": () => {
        this._state!.balance -= (event as DebitEvent).body.amount;
      },
    }

    if (aggregateFunction[event.type]) aggregateFunction[event.type]();

    return this._state;
  }

  public static createAccount(id: string, info: Omit<Account, 'balance'>, eventStore: EventStore) {
    const account = this.findById(id, eventStore);
    if (account.version > 0) throw new AccountAlreadyExistsError(id);

    account.createEvent('AccountCreated', info);
    return id;
  }

  public updateAccount(info: Partial<Omit<Account, 'balance'>>) {
    if (!this._state) throw new AccountNotFoundError(this.id);
    
    this.createEvent('AccountUpdated', info);
    return true;
  }

  public creditBalance(amount: number) {
    if (!this._state) throw new AccountNotFoundError(this.id);

    this.createEvent('BalanceCredited', { amount });
    return true;
  }

  public debitBalance(amount: number) {
    if (!this._state) throw new AccountNotFoundError(this.id);
    if (this._state.balance < amount) throw new InsufficientFundError(this.id);

    this.createEvent('BalanceDebited', { amount });
    return true;
  }
}
