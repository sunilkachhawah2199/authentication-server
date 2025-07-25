import { Request, Response } from "express";
import { fetchUserAgents } from "../services/userService";
import { invoiceAgentService } from "../services/agentService";
import { BadRequestError } from "../exceptions/applicationErrors";

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

// process invoice with binary file
export const processInvoiceController = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            })
        }

        // Check if file was uploaded
        if (!req.file) {
            throw new BadRequestError("No CSV file was uploaded. Please select a CSV file.");
        }

        const request = {
            email: req.user.email,
            file: req.file.buffer
        };

        const result = await invoiceAgentService(request);

        return res.status(200).json({
            success: true,
            message: "CSV processing completed successfully",
            result: result
        });

    } catch (err: any) {
        console.log("Error in processing CSV: ", err.message);

        if (err instanceof BadRequestError) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error processing CSV",
            error: err.message
        });
    }
}