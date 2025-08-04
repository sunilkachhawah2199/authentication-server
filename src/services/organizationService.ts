import { fetchOrganization, Organization } from "../models/organizationModel";
import { v4 as uuidv4 } from 'uuid';
import { FIREBASE_COLLECTIONS } from "../constants/firestore";
import { db } from "../utils/firebase_admin_sdk";
import { findByEMail } from "../services/userService";

import { updateUser } from "./userService";
import { IUserRegister } from "../models/userModel";

export const createOrganization = async (org: Organization) => {
    try {
        const orgUuid = `org-${uuidv4()}`
        org.orgId = orgUuid;
        org.isActive = true;
        org.createdAt = new Date();
        org.updatedAt = new Date();
        const docRef = await db().collection(FIREBASE_COLLECTIONS.ORGANIZATIONS).add({
            ...org
        })
        const save = await docRef.get()
        const orgData = save.data();
        console.log("agent created with id:", orgUuid);
        return orgData;
    } catch (err: any) {
        console.log("Error creating organization", err.message);
        throw new Error(`Error in creating organization: ${err.message}`);
    }
}

// find organization by id
export const findOrganizationById = async (orgId: string): Promise<fetchOrganization | null> => {
    try {
        const org = await db().collection(FIREBASE_COLLECTIONS.ORGANIZATIONS).where('orgId', '==', orgId).get();
        if (org.empty) {
            return null;
        }
        const orgData = org.docs[0].data() as fetchOrganization;
        const op: fetchOrganization = {
            orgId: orgData.orgId,
            name: orgData.name,
            logo: orgData.logo,
            description: orgData.description,
        }
        return op;
    } catch (err: any) {
        console.log(`orgnization not found with ${orgId}`)
        throw new Error(`orgnization not found with ${orgId}`)
    }
}

// add orgnization field in user
export const addUserInOrganization = async (orgId: string, email: string) => {
    try {
        const user: IUserRegister | null = await findByEMail(email);
        if (!user) {
            throw new Error("User not found");
        }

        const org: fetchOrganization | null = await findOrganizationById(orgId);
        if (!org) {
            throw new Error("Organization not found");
        }

        // add org in user table
        user.organization = orgId;

        const updatedUser = await updateUser(user);
        return updatedUser;


    } catch (err: any) {
        console.log(`org id: ${orgId} can't be updated in user table`);
        throw new Error(`error in adding orgnization in user table: ${err.message}`);
    }
}