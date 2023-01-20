import { AggregateType, Event } from '../../../events';
import { IAccountInformation } from '../../../interfaces';
import EventStore from '../library/eventstore';
import Projection from '../library/projection';
import { collections, connectToDatabase } from '../services/database';

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
    if (!collections.accounts) {
      connectToDatabase()
        .then(() => console.log("Hello"))
        .catch(() => console.log("err"));
    }

    try {
      const accounts = (await collections.accounts?.find({}).toArray());
      console.log(accounts);

    } catch (error) {
      console.log(error);
    }
    // TODO: Implement this method, to maintain a state in your database.
    // You can choose any database of your own, but suggested is MongoDB.

    // console.log(event);
  }
}