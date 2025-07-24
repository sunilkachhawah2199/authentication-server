import { generateToken } from "../middleware/authMiddleware";
import { findByEMail, IUserRegister} from "../models/userModel";

import { getAgentByIdService } from "./agentService";
import { db } from "../utils/firebase_admin_sdk";
import { FIREBASE_COLLECTIONS } from "../constants/firestore";

// update user
export const updateUser = async (user: IUserRegister): Promise<IUserRegister> => {
    try {
        const { uuid } = user;
        if (!uuid) {
            throw new Error("User UUID is required to update.");
        }
        const userQuery = await db().collection(FIREBASE_COLLECTIONS.USERS).where("uuid", "==", uuid).limit(1).get();

        if (userQuery.empty) {
            throw new Error("User not found");
        }

        const userDocRef = userQuery.docs[0].ref;

        const { password, uuid: userId, createdAt, ...updateData } = user;

        const updatePayload = {
            ...updateData,
            updatedAt: new Date(),
        };

        await userDocRef.update(updatePayload);

        const updatedUserDoc = await userDocRef.get();
        return updatedUserDoc.data() as IUserRegister;

    } catch (err: any) {
        console.log("error in updating profile", err.message);
        throw new Error(`Error in updating profile: ${err.message}`);
    }
}

// // update user --> add agent in user profile
export const addAgentToUserService = async (email: string, agentId: string[]) => {
    try {
        if (!email) {

        }
        const user = await findByEMail(email);
        if (!user) {
            throw new Error("User not found");
        }
        let userAgents = user.agents || [];
        for (let id in agentId) {
            const agent = await getAgentByIdService(agentId[id]);
            console.log("agent ", agent)
            if (!agent) {
                throw new Error("Agent not found");
            }
            if (!userAgents.includes(agentId[id])) {
                userAgents.push(agentId[id]);
            }
        }
        user.agents = userAgents;
        const updatedUser = await updateUser(user);
        return updatedUser;

    } catch (error: any) {
        console.error("Error adding agent to user", error.message);
        throw new Error(`Error adding agent to user: ${error.message}`);
    }
}

// fetch agent of user:
export const fetchUserAgents = async (email: string) => {
    try {
        const user = await findByEMail(email);
        if (!user) {
            throw new Error("User not found");
        }

        const agentsIds = user.agents;
        if (!agentsIds?.length)
            return [];

        let agents = [];
        for (let id in agentsIds) {
            const agent = await getAgentByIdService(agentsIds[id]);
            // if agent not found just skip it
            if (!agent) {
                continue;
            }
            agents.push(agent);
        }
        return agents;

    } catch (err: any) {
        console.error("Error fetching user agents", err.message);
        throw new Error(`Error fetching user agents: ${err.message}`);
    }
}

