import { IAgentRegister, AgentType } from "../../models/agentModel";
import { BadRequestError } from "../../exceptions/applicationErrors";
import { Request, Response } from "express";
import { createAgentService, getAllAgentService } from "../../services/agentService";
import { addAgentToUserService } from "../../services/userService";

export const createAgentController = async (req: Request, res: Response) => {
    try {
        const { name, host, apiKey, description, tags, icon } = req.body

        if (!name || !host || !apiKey || !description || !tags || !icon) {
            throw new BadRequestError("All fields are required");
        }

        // Validate that name is a valid agent type
        if (!Object.values(AgentType).includes(name)) {
            throw new BadRequestError("Name must be a valid agent type (INSURANCE or INVOICE)");
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


export const addAgentToUserController = async (req: Request, res: Response) => {
    try {
        const { email, agentId } = req.body;
        console.log(agentId)
        const response = await addAgentToUserService(email, agentId);
        return res.status(200).json(response);
    } catch (error: any) {

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}