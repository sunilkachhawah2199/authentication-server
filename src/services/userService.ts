import { generateToken } from "../middleware/authMiddleware";
import { findByEMail, insertUser, IUserLogin, IUserRegister, User, Tool } from "../models/userModel";
import {
    UserExistsError,
    InvalidCredentialsError
} from "../exceptions/userErrors";
import {
    DatabaseQueryError
} from "../exceptions/databaseErrors";
import bcrypt from 'bcryptjs';
import { getAgentByIdService } from "./agentService";
import { db } from "../utils/firebase_admin_sdk";
import { FIREBASE_COLLECTIONS } from "../constants/firestore";


export const loginService = async (user: IUserLogin): Promise<{ token: string, user: User }> => {
    try {
        const { email, password } = user;

        // find user with email in db
        let userData;
        try {
            userData = await findByEMail(email);
        } catch (error: any) {
            console.error("user not found in database:", error);
            throw new InvalidCredentialsError("Invalid email or password");
        }

        // User existence check
        if (!userData || userData.email !== email) {
            throw new InvalidCredentialsError("Invalid email or password");
        }

        // Compare password with hashed password in database
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            throw new InvalidCredentialsError("Invalid email or password");
        }


        const registeredUser: User = {
            email: userData.email,
            name: userData.name,
            organization: userData.organization,
            tool: userData.tool as Tool
        }

        // token generation
        const token = generateToken(registeredUser);

        // Return both token and user data
        return {
            token,
            user: registeredUser
        };

    } catch (error: any) {
        // Log the error for debugging
        console.error(`Login service error: ${error.name} - ${error.message}`);

        // Re-throw to be handled by the controller
        throw error;
    }
}

export const signupService = async (user: IUserRegister): Promise<User> => {
    try {
        const { email, password } = user;


        // Check if user exists
        let userExists;
        try {
            userExists = await findByEMail(email);
        } catch (error: any) {
            console.error("Database error while checking user existence:", error);
            throw new DatabaseQueryError("Failed to check if user exists");
        }

        if (userExists) {
            throw new UserExistsError("User already exists");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);



        // Insert user with hashed password
        let userData;
        try {
            userData = await insertUser({
                ...user,
                password: hashedPassword,
            });
        } catch (error: any) {
            console.error("Database error while inserting user:", error);
            throw new DatabaseQueryError("Failed to create user");
        }

        console.log("User created successfully");

        return {
            email: userData.email,
            name: userData.name,
            organization: userData.organization,
            tool: userData.tool,
        };
    } catch (error: any) {
        // Log the error for debugging
        console.error(`Signup service error: ${error.name} - ${error.message}`);

        // Re-throw to be handled by the controller
        throw error;
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
                userAgents.push(id);
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

