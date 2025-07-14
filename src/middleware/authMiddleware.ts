import { User } from "../models/userModel";
import { NextFunction, Request, Response } from "express"
import { sign, verify, JwtPayload } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "";

// Extend Express Request interface to include user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                organization: string;
                tool: string;
            };
        }
    }
}

// Generate token for user
export const generateToken = (user: User) => {
    try {
        const payload = {
            email: user.email,
            name: user.name,
            organization: user.organization,
            tool: user.tool
        }
        return sign(payload, JWT_SECRET, { expiresIn: "24h" });
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
            const decoded = verify(token, JWT_SECRET) as JwtPayload;
            console.log("decoded: ", decoded);

            // Add user data to request object
            req.user = {
                email: decoded.email,
                name: decoded.name,
                organization: decoded.organization,
                tool: decoded.tool
            };

            return next();
        }
        catch (err: any) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
    }
    catch (err: any) {
        console.log(err);
        return res.status(500).json({
            message: err.message
        })
    }
}