import { TotalApprovedAmounts } from "../../../events";
import { Account } from "../aggregate/account";
import { Identifiers } from "./Identifiers";

export type AccountModel = Account & TotalApprovedAmounts & Partial<Identifiers>;