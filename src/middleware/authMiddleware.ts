import { User } from "../models/userModel";
import { NextFunction, Request, Response } from "express"
import { sign, verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "";

// Generate token for user
export const generateToken = (user: User ) => {
    try {
        const payload = {
            email: user.email,
            name: user.name,
            organization: user.organization,
            tool: user.tool
        }
        return sign(payload, JWT_SECRET, { expiresIn: "2h" });
    }
    catch (err: any) {
        console.log(err);
        throw new Error("Error generating token");
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        // Extract token from "Bearer <token>" format
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

        console.log("token: ", token);
        console.log("JWT_SECRET: ", JWT_SECRET);

        try {
            const decoded = verify(token, JWT_SECRET);
            console.log("decoded: ", decoded);
        }
        catch (err: any) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        return next();
    }
    catch (err: any) {
        console.log(err);
        return res.status(500).json({
            message: err.message
        })
    }
}