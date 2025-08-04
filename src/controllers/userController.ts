import { Request, Response } from "express";
import { fetchUserAgents, findByUuid, getUserOrganization } from "../services/userService";

// fetch user agents
export const fetchUserAgentController = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            })
        }
        const agents = await fetchUserAgents(req.user.email);
        return res.status(200).json({
            success: true,
            message: "User agents fetched successfully",
            agents
        })
    } catch (err: any) {
        console.log("error in fecthing error ", err.message)
        return res.status(500).json({
            "message": "error in getting user agenta",
            "error": err.message
        })
    }
}

//  get user's organization
export const getUserOrganizationController = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        const organization = await getUserOrganization(req.user.email);
        return res.status(200).json({
            success: true,
            message: "User organization fetched successfully",
            organization
        });
    } catch (err: any) {
        console.log("error in getting user organization", err.message);
        return res.status(500).json(
            {
                "message": "error in getting user organization",
                "error": err.message
            }
        );
    }
}

// get user's profile
export const getUserProfileController = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        // find user by uuid
        const user = await findByUuid(req.user.uuid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json(user)
    }
    catch (err: any) {
        return res.status(500).json({
            "message": "error in getting user profile",
            "error": err.message
        })
    }
}