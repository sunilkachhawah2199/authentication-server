import { Request, Response } from "express";
import { fetchUserAgents} from "../services/userService";

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