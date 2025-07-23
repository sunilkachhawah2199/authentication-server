import { db } from "../utils/firebase_admin_sdk";
import { v4 as uuidv4 } from 'uuid';
import { IAgentRegister, IAgentRegisterResponse } from "../models/agentModel";
import { FIREBASE_COLLECTIONS } from "../constants/firestore";

export const createAgentService = async (agent: IAgentRegister) => {
    try {
        const agentUuid = uuidv4();
        agent.agentId = agentUuid;
        agent.isActive = true;
        agent.updatedAt = new Date();
        const docRef = await db().collection(FIREBASE_COLLECTIONS.AGENTS).add({
            ...agent
        })

        const save = await docRef.get()
        const agentData = save.data();

        console.log("Agent created with ID:", docRef.id);

        return agentData;
    } catch (err: any) {
        console.log("Error creating agent", err.message);
        throw new Error(`Error in creating agent: ${err.message}`);
    }
}

export const getAllAgentService = async (): Promise<IAgentRegisterResponse[]> => {
    try {
        const agentsSnapshot = await db().collection(FIREBASE_COLLECTIONS.AGENTS).get();

        const agentData = agentsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                agentId: data.agentId,
                name: data.name,
                description: data.description,
                tags: data.tags,
                icon: data.icon,
            } as IAgentRegisterResponse;
        });

        return agentData;
    } catch (err: any) {
        console.log("Error getting agent", err.message);
        throw new Error(`Error in getting agents: ${err.message}`);
    }
}

export const getAgentByIdService = async (agentId: string) => {
    try {
        const agent = await db().collection(FIREBASE_COLLECTIONS.AGENTS).where("agentId", "==", agentId).get();

        if (agent.empty) {
            return null;
        }

        return agent.docs[0].data();
    } catch (err: any) {
        console.log("Error getting agent", err.message);
        throw new Error(`Error in getting agent: ${err.message}`);
    }
}