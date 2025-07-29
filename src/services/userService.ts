import { IUserRegister, User } from "../models/userModel";
import { v4 as uuidv4 } from 'uuid';

import { getAgentByIdService } from "./agentService";
import { db } from "../utils/firebase_admin_sdk";
import { FIREBASE_COLLECTIONS } from "../constants/firestore";
import { findOrganizationById } from "./organizationService";

// find user by email: output --> IUserRegister | null
export const findByEMail = async (email: string): Promise<IUserRegister | null> => {
    try {
        const user = await db().collection(FIREBASE_COLLECTIONS.USERS).where('email', '==', email).get();
        if (user.empty) {
            return null;
        }

        // Get the first matching document and include the document ID
        const userDoc = user.docs[0];
        const userData = userDoc.data() as IUserRegister;

        // Log the user data for debugging
        console.log("User found:", userData);

        return userData;
    } catch (err) {
        console.log(err);
        throw new Error("Error finding user by email");
    }
}

// find user by uuid
export const findByUuid = async (uuid: string): Promise<User | null> => {
    try {
        const user = await db().collection(FIREBASE_COLLECTIONS.USERS).where('uuid', '==', uuid).get();
        if (user.empty) {
            return null;
        }

        // Get the first matching document and include the document ID
        const userDoc = user.docs[0];
        const userData = userDoc.data() as IUserRegister;
        const userOp: User = {
            email: userData.email,
            name: userData.name,
            organization: userData.organization,
            uuid: userData.uuid,
            agents: userData.agents || []
        }

        // Log the user data for debugging
        console.log("User found:", userData);

        return userOp;
    } catch (err) {
        console.log(err);
        throw new Error("Error finding user by uuid");
    }
}


// add new user to firestore
export const insertUser = async (userData: IUserRegister): Promise<User> => {
    try {
        // uuid generate for users
        const uuid = uuidv4();
        console.log("myUuid", uuid);
        const { email, name, password, organization } = userData;

        // Insert user into Firebase Firestore
        const userRef = await db().collection(FIREBASE_COLLECTIONS.USERS).add({
            email,
            name,
            password,
            organization,
            uuid,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log("User inserted with ID:", userRef.id);

        const savedUser = {
            email,
            name,
            organization,
            uuid,
            agents: []
        }
        // Return the user data without password for security
        return savedUser;
    } catch (err) {
        console.log(err);
        throw new Error("Error inserting user");
    }
}

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

// update user --> add agent in user profile
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

// fetch agent of specific user:
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
            agents.push(agent[0]);
        }
        return agents;

    } catch (err: any) {
        console.error("Error fetching user agents", err.message);
        throw new Error(`Error fetching user agents: ${err.message}`);
    }
}

// get user's organization
export const getUserOrganization = async (email: string) => {
    try {
        const user = await findByEMail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const organization = await findOrganizationById(user.organization);
        return organization;
    } catch (err: any) {
        console.error("Error fetching user organization", err.message);
        throw new Error(`Error fetching user organization: ${err.message}`);
    }
}