// dto for creating new agent
export interface Agent {
    id: string;
    name: string;
    organization_id: string;
    host_server: string;
    api_key: string;
    isActive: boolean;
    updated_at: Date;
}

// dto for returning agent data
export interface savedAgent{
    id: string,
    name: string;
    organization_id: string;
}


