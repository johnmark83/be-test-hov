import * as mongoDB from "mongodb";
import { config } from "../config/config";

export const collections: { accounts?: mongoDB.Collection, depositsCreated?: mongoDB.Collection, withdrawalsCreated?: mongoDB.Collection } = {};

export async function connectToDatabase() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(config.mongo.url);

    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    const accountsCollection: mongoDB.Collection = db.collection(config.accountCollection.name);
    const depositCreatedCollection: mongoDB.Collection = db.collection("DepositsCreated");
    const withdrawalsCreatedCollection: mongoDB.Collection = db.collection("WithdrawalsCreated");

    collections.accounts = accountsCollection;
    collections.depositsCreated = depositCreatedCollection;
    collections.withdrawalsCreated = withdrawalsCreatedCollection;
}