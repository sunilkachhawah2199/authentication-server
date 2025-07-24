export enum AgentType {
    INSURANCE,
    INVOICE
}

export interface IAgentRegister {
    agentId?: string;
    name: AgentType;
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
    name: AgentType;
    description: string;
    tags: string;
    icon: string;
}