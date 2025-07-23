import { IAgentRegister } from "../models/agentModel";
import { BadRequestError } from "../exceptions/applicationErrors";
import { Request, Response } from "express";
import { createAgentService, getAllAgentService } from "../services/agentService";

export const createAgentController = async (req: Request, res: Response) => {
    try {
        const { name, host, apiKey, description, tags, icon } = req.body
        if (!name || !host || !apiKey || !description || !tags || !icon) {
            throw new BadRequestError("All fields are required");
        }
        const agent: IAgentRegister = {
            name,
            host,
            apiKey,
            description,
            tags,
            icon
        }
        const createdAgent = await createAgentService(agent)
        return res.status(200).json(createdAgent);
    } catch (err: any) {
        console.log("Error creating agent", err.message);
        return res.status(500).json({
            message: "Error creating agent",
            error: err.message
        })
    }
}


export const getAllAgentController = async (req: Request, res: Response) => {
    try {
        const agents = await getAllAgentService();
        return res.status(200).json(agents);
    } catch (err: any) {
        console.log("Error getting agent", err.message);
        return res.status(500).json({
            message: "Error getting agent",
            error: err.message
        })
    }
}
