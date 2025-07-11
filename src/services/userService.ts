import { generateToken } from "../middleware/authMiddleware";
import { findByEMail, insertUser, IUserLogin, IUserRegister, User, Tool } from "../models/userModel";
import {
    UserExistsError,
    InvalidCredentialsError
} from "../exceptions/userErrors";
import {
    DatabaseQueryError
} from "../exceptions/databaseErrors";
import { BadRequestError } from "../exceptions/applicationErrors";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

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
        const { email, password, tool } = user;


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

        // uuid generate for users
        const myUuid = uuidv4();

        // Insert user with hashed password
        let userData;
        try {
            userData = await insertUser({
                ...user,
                password: hashedPassword,
                uuid: myUuid
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