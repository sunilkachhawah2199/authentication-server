import { IAgentRegister, AgentType } from "../../models/agentModel";
import { BadRequestError } from "../../exceptions/applicationErrors";
import { Request, Response } from "express";
import { createAgentService, getAllAgentService } from "../../services/agentService";
import { addAgentToUserService } from "../../services/userService";
import { addUserInOrganization, createOrganization } from "../../services/organizationService";
import { Organization } from "../../models/organizationModel";
import logger from "../../utils/logger";

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
        logger.error("Error creating agent", err);
        return res.status(500).json({
            message: "Error creating agent",
            error: err.message
        })
    }
}

// fetch all the agents
export const getAllAgentController = async (req: Request, res: Response) => {
    try {
        const agents = await getAllAgentService();
        return res.status(200).json(agents);
    } catch (err: any) {
        logger.error(`Error getting agent ${err}`);
        return res.status(500).json({
            message: "Error getting agent",
            error: err.message
        })
    }
}

// assign agent to any user
export const addAgentToUserController = async (req: Request, res: Response) => {
    try {
        const { email, agentId } = req.body;
        const response = await addAgentToUserService(email, agentId);
        return res.status(200).json(response);
    } catch (error: any) {
        logger.error(`Error adding agent to user: ${error}`);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

// create organization controller
export const createOrganizationController = async (req: Request, res: Response) => {
    try {
        const { name, logo, description } = req.body;
        if (!name || !logo || !description) {
            throw new BadRequestError("please provide org name, logo, description")
        }
        const org: Organization = {
            name,
            logo,
            description
        }
        const organization = await createOrganization(org);
        return res.status(200).json({
            message: "Organization created successfully",
            organization
        });
    } catch (err: any) {
        logger.error(`Error creating organization, ${err}`);
        return res.status(500).json({
            message: "Error creating organization",
            error: err.message
        })
    }
}

// connect user and organization
export const addUserInOrganizationController = async (req: Request, res: Response) => {
    try {
        const { email, orgId } = req.body;
        if (!email || !orgId) {
            throw new BadRequestError("please provide email and orgId")
        }
        const response = await addUserInOrganization(orgId, email);

        logger.info({
            task: "user connected to organization successfully",
            user: email,
            organization: orgId
        })

        return res.status(200).json({
            message: "User connected to organization successfully",
            response
        });
    } catch (err: any) {
        logger.error(`Error connecting user to organization: ${err}`);
        return res.status(500).json({
            message: "Error connecting user to organization",
            error: err.message
        })
    }
}