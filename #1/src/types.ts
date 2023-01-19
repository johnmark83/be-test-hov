import { AggregateType } from "../../events";

export interface AccountInformation {
    email: string;
    fullName: string;
    password: string;
    username: string;
    totalApprovedDepositAmount: number | 0;
    totalApprovedWithdrawalAmount: number | 0;
}

export interface Event {
    aggregateId: string;
    aggregateType: AggregateType,
    type: string,
    version: number,
    body: EventBody
}

export interface EventBody {
    username?: string,
    fullName?: string,
    password?: string,
    email?: string,
    account?: string,
    amount?: number
}