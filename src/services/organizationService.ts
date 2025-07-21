import { FIREBASE_COLLECTIONS } from "../constants/firestore";
import { registeredOrg, organization } from "../models/organizationModel";
import { v4 as uuidv4 } from 'uuid';
import { db } from "../utils/firebase_admin_sdk";
import { savedAgent } from "../models/agentModel";

export const createOrganizationService = async (orgData: organization): Promise<registeredOrg | void> => {
    try {
        // uuid generate for users
        const orgUuid = `organization${uuidv4()}`;
        console.log("org uuid", orgUuid);
        const docRef = await db().collection(FIREBASE_COLLECTIONS.ORGANIZATIONS).add({
            ...orgData,
            organization_id: orgUuid,
            isActive: true,
            updatedAt: new Date(),
        })
         // Get the saved data from docRef
         const savedDoc = await docRef.get();
         const savedData = savedDoc.data() as savedAgent;
        const savedOrg: registeredOrg = {
            organization_id: savedData.organization_id,
            name: savedData.name,
        }
        return savedOrg;
    }
    catch (err: any) {
        console.log("error while inserting organization", err);
        throw new Error("Error inserting organization");
    }
}