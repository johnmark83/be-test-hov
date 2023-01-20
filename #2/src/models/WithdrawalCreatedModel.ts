import { WithdrawalCreated } from "../../../events";
import { Identifiers } from "./Identifiers";

export type WithdrawalCreatedModel = WithdrawalCreated & Partial<Identifiers>;