import { Request, Response, NextFunction } from "express";
import { loginService, signupService } from "../services/userService";
import { IUserLogin, IUserRegister, Tool } from "../models/userModel";
import { BadRequestError } from "../exceptions/applicationErrors";

// check if tool is valid
const isValidTool = (tool: string): boolean => {
    return Object.values(Tool).includes(tool as Tool);
};

// Login controller
export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Basic request validation
        if (!email || !password) {
            throw new BadRequestError("Email and password are required");
        }

        const userInput: IUserLogin = { email, password };

        // Attempt to login
        const result = await loginService(userInput);

        // Success response
        return res.status(200).json({
            status: true,
            message: "Login Successfull",
            token: result.token,
            user: result.user
        });

    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            status: false,
            message: error.message
        });
    }
}

// Signup controller
export const signupController = async (req: Request, res: Response) => {
    try {
        const { email, password, name, organization, tool } = req.body;

        // Basic request validation
        if (!email || !password || !name || !organization || !tool) {
            throw new BadRequestError("All fields are required");
        }

        // Validate tool type
        if (!isValidTool(tool)) {
            throw new BadRequestError(`Invalid tool type. Must be one of: ${Object.values(Tool).join(", ")}`);
        }

        const userInput: IUserRegister = {
            email,
            password,
            name,
            organization,
            tool: tool as Tool
        };

        // Attempt to create user
        const user = await signupService(userInput);

        // Success response
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        });
    } catch (error: any) {
        // Use error's status code if available
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}