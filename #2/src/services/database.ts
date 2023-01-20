import * as mongoDB from "mongodb";
import { config } from "../config/config";

export const collections: { accounts?: mongoDB.Collection } = {};

export async function connectToDatabase() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(config.mongo.url);

    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    const accountsCollection: mongoDB.Collection = db.collection(config.accountCollection.name);

    collections.accounts = accountsCollection;

    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${accountsCollection.collectionName}`);
}