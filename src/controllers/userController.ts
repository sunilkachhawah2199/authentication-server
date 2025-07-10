import { Request, Response, NextFunction } from "express";
import { loginService, signupService } from "../services/userService";
import { IUserLogin, IUserRegister } from "../models/userModel";
import { BadRequestError } from "../exceptions/applicationErrors";

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
        const token = await loginService(userInput);

        // Success response
        return res.status(200).json({
            status: true,
            message: "Login Successfull",
            token: token
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

        const userInput: IUserRegister = { email, password, name, organization, tool };

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