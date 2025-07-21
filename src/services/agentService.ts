import { FIREBASE_COLLECTIONS } from "../constants/firestore";
import { v4 as uuidv4 } from 'uuid';
import { db } from "../utils/firebase_admin_sdk";
import { Agent, savedAgent } from "../models/agentModel";

export const createAgentService = async (agentData: Agent): Promise<savedAgent> => {
    try {
        const agentUuid = `agent${uuidv4()}`;
        const docRef = await db().collection(FIREBASE_COLLECTIONS.AGENTS).add({
            ...agentData,
            id: agentUuid,
            isActive: true,
            updated_at: new Date(),
        })

        // Get the saved data from docRef
        const savedDoc = await docRef.get();
        const savedData = savedDoc.data() as savedAgent;

        // Print all saved data
        console.log("Document ID:", docRef.id);
        console.log("All saved agent data:", savedData);
        console.log("Agent ID:", savedData.id);
        console.log("Agent Name:", savedData.name);
        console.log("Organization ID:", savedData.organization_id);
        console.log("Complete Agent Data:", JSON.stringify(savedData, null, 2));

        return savedData;
    }
    catch (err: any) {
        throw new Error("Error inserting/creating agent");
    }
}