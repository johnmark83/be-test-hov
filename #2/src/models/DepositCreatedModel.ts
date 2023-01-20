import { DepositCreated } from "../../../events";
import { Identifiers } from "./Identifiers";

export type DepositCreatedModel = DepositCreated & Partial<Identifiers>;