import dotenv from 'dotenv';

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL=`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.wiipzno.mongodb.net`;
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;
const DB_NAME = process.env.DB_NAME ?? '';
const ACCOUNT_COLLECTION_NAME = process.env.ACCOUNT_COLLECTION_NAME ?? '';
const WITHDRAWALSCREATED_COLLECTION_NAME = process.env.WITHDRAWALSCREATED_COLLECTION_NAME ?? '';
const DEPOSITSCREATED_COLLECTION_NAME = process.env.DEPOSITSCREATED_COLLECTION_NAME ?? '';

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    },
    database: {
        name: DB_NAME
    },
    collections: {
        accounts: {
            name: ACCOUNT_COLLECTION_NAME
        },
        withdrawalsCreated : {
            name: WITHDRAWALSCREATED_COLLECTION_NAME
        },
        depositsCreated : {
            name: DEPOSITSCREATED_COLLECTION_NAME
        }
    }
}

