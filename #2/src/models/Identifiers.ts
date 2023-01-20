import { ObjectId } from "mongodb"

export type Identifiers = {
    _id: ObjectId;
    aggregateId: string
}
