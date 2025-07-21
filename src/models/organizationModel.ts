export interface organization {
    name: string;
    organization_id: string;
    isActive: boolean;
    updated_at: Date;
}

// dto: after organization registered
export interface registeredOrg{
    organization_id: string;
    name: string;
}
