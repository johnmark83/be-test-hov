import { Account } from "../aggregate/account";
import { ObjectId } from "mongodb";

export type ObjectID = {
    _id?: ObjectId
}

export type AccountModel = Account & ObjectId;