import { generateToken } from "../middleware/authMiddleware";
import { findByEMail, insertUser, IUserLogin, IUserRegister, User } from "../models/userModel";
import {
    UserValidationError,
    UserExistsError,
    InvalidCredentialsError
} from "../utils/userErrors";
import {
    DatabaseQueryError
} from "../utils/databaseErrors";
import { BadRequestError } from "../utils/applicationErrors";

export const loginService = async (user: IUserLogin): Promise<string> => {
    try {
        const { email, password } = user;

        // Input validation
        if (!email || !password) {
            throw new BadRequestError("Email and password are required");
        }

        // Database operation with error handling
        let userData;
        try {
            userData = await findByEMail(email);
        } catch (error: any) {
            console.error("user not found in database:", error);
            throw new InvalidCredentialsError("Invalid email or password");
        }

        // User existence check
        if (!userData || userData.email !== email || userData.password !== password) {
            throw new InvalidCredentialsError("Invalid email or password");
        }

        const registeredUser: User = {
            email: userData.email,
            name: userData.name,
            organization: userData.organization,
            tool: userData.tool
        }

        // token generation
        return generateToken(registeredUser);
        
    } catch (error: any) {
        // Log the error for debugging
        console.error(`Login service error: ${error.name} - ${error.message}`);

        // Re-throw to be handled by the controller
        throw error;
    }
}

export const signupService = async (user: IUserRegister): Promise<User> => {
    try {
        const { email, name, password, organization, tool } = user;

        // Input validation
        if (!email || !password || !name || !organization || !tool) {
            throw new UserValidationError("All fields are required");
        }

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

        // Insert user
        let userData;
        try {
            userData = await insertUser(user);
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