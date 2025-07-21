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


// export const newSignupService = async (user: IUserRegister) => {
//     const { uuid, name, email, password, organization_id, access_type, agents } = user
//     // Check if user exists
//     let userExists;
//     try {
//         userExists = await findByEMail(email);
//     } catch (error: any) {
//         console.error("Database error while checking user existence:", error);
//         throw new DatabaseQueryError("Failed to check if user exists");
//     }

//     // create agents entry --> save using create agent function
//     let savedAgents: savedAgent[] = [];

//     if (agents && agents.length > 0) {
//         console.log(`Processing ${agents.length} agents for user: ${email}`);

//         // Iterate through all agents and save them
//         for (let i = 0; i < agents.length; i++) {
//             const agent = agents[i];
//             console.log(`Saving agent ${i + 1}/${agents.length}: ${agent.name}`);

//             try {
//                 // Save each agent using createAgentService
//                 const savedAgent = await createAgentService(agent);
//                 savedAgents.push(savedAgent);
//                 console.log(`Successfully saved agent: ${savedAgent.id}`);
//             } catch (error) {
//                 console.error(`Failed to save agent ${agent.name}:`, error);
//                 // You can choose to continue or throw error based on your requirements
//                 throw new Error(`Failed to save agent: ${agent.name}`);
//             }
//         }

//         console.log(`Successfully saved all ${savedAgents.length} agents`);
//         console.log("All saved agents:", savedAgents);
//         return;
//     } else {
//         console.log("No agents to save for this user");
//     }
// }