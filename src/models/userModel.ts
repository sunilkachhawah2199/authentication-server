import { FIREBASE_COLLECTIONS } from "../constants/firestore";
import { db } from "../utils/firebase_admin_sdk";
import { v4 as uuidv4 } from 'uuid';

export interface IUserLogin {
    email: string;
    password: string;
}

export enum Tool {
    "insurance" = "INSURANCE",
    "invoice" = "INVOICE"
}

export interface IUserRegister extends IUserLogin {
    uuid: string;
    name: string;
    organization: string;
    tool: Tool;
    agents?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface User {
    email: string;
    name: string;
    organization: string;
    tool: Tool;
}


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


export const insertUser = async (userData: IUserRegister): Promise<User> => {
    try {
        // uuid generate for users
        const uuid = uuidv4();
        console.log("myUuid", uuid);
        const { email, name, password, tool, organization } = userData;

        // Insert user into Firebase Firestore
        const userRef = await db().collection(FIREBASE_COLLECTIONS.USERS).add({
            email,
            name,
            password,
            tool,
            organization,
            uuid,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log("User inserted with ID:", userRef.id);

        const savedUser={
            email,
            name,
            organization,
            tool
        }
        // Return the user data without password for security
        return savedUser;
    } catch (err) {
        console.log(err);
        throw new Error("Error inserting user");
    }
}

