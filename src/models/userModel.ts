export interface IUserLogin {
    email: string;
    password: string;
}

export enum Tool {
    "insurance" = "INSURANCE",
    "invoice" = "INVOICE"
}

export interface IUserRegister extends IUserLogin {
    uuid: string;
    name: string;
    organization: string;
    agents?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface User {
    email: string;
    name: string;
    organization: string;
    uuid?: string;
    agents: string[];
}

