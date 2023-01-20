import { AggregateType } from "./events";

export interface IUserCredentials {
    email: string;
    fullName: string;
    password: string;
    username: string;
}

export interface IAccountInformation extends IUserCredentials {
    totalApprovedDepositAmount: number | 0;
    totalApprovedWithdrawalAmount: number | 0;
}

export interface IEvent {
    aggregateId: string;
    aggregateType: AggregateType,
    type: string,
    version: number,
    body: IEventBody
}

export interface IEventBody {
    username?: string,
    fullName?: string,
    password?: string,
    email?: string,
    account?: string,
    amount?: number
}