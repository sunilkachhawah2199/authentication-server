import { Bool } from "aws-sdk/clients/clouddirectory";

export interface IAgentRegister {
    agentId?: string;
    name: string;
    description: string;
    isActive?: Boolean;
    host: string;
    apiKey: string;
    tags: string;
    icon: string;
    updatedAt?: Date;
}

export interface IAgentRegisterResponse {
    agentId: string;
    name: string;
    description: string;
    tags: string;
    icon: string;
}