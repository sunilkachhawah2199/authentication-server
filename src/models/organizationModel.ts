export interface Organization {
    orgId?: string;
    name: string;
    logo: string;
    description: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface fetchOrganization {
    orgId: string;
    name: string;
    logo: string;
    description: string;
    // isActive: boolean;
    // createdAt: Date;
    // updatedAt: Date;
}