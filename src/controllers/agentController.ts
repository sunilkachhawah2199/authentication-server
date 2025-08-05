import { Request, Response } from "express";
import { invoiceAgentService } from "../services/agentService";
import { BadRequestError } from "../exceptions/applicationErrors";
import { uploadPdfService } from "../services/pdfService";
import logger from "../utils/logger";


// Route handler for insurance api
export const insuranceController = async (req: Request, res: Response) => {

    try {
        // Access query parameter
        const { agentId } = req.query; // Use req.query for query parameters

        // Validate that agentId is provided
        if (!agentId) {
            return res.status(400).json({
                status: false,
                message: "Agent ID is required as a query parameter",
                error: "MISSING_AGENT_ID"
            });
        }

        // No need to check for files here as validateFileUpload middleware already does this
        // Get user email from the request object (added by verifyToken middleware)
        if (!req.user || !req.user.email || !req.user.agents.includes(agentId as string)) {
            logger.error("Upload failed: User not authenticated properly");
            return res.status(401).json({
                status: false,
                message: "User not authenticated properly",
                error: "AUTHENTICATION_ERROR"
            });
        }

        const userEmail = req.user.email;
        logger.info(`Processing upload for user: ${userEmail}`);

        // upload all the pdf file to s3 bucket, passing the user's email
        const result = uploadPdfService(req.files as Express.Multer.File[], userEmail);


        return res.status(200).json({
            status: true,
            message: `${(req.files as Express.Multer.File[]).length} files uploaded successfully, you will get response over your email: ${userEmail} in some time.`
        });
    } catch (err: any) {
        logger.error("Error during S3 upload:", err);
        return res.status(err.statusCode || 500).json({
            status: false,
            message: err.message || "Failed to upload files to cloud",
            error: err.code || "S3_UPLOAD_ERROR"
        });
    }
};


// process invoice with binary file
export const processInvoiceController = async (req: Request, res: Response) => {
    try {
        const { agentId } = req.query; // Use req.query for query parameters

        if (!req.user || !req.user.agents.includes(agentId as string)) {
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

        return res.status(200).json(result);

    } catch (err: any) {
        logger.error("Error in processing CSV: ", err);

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