import { Request, Response } from "express";
import { invoiceAgentService } from "../services/agentService";
import { BadRequestError } from "../exceptions/applicationErrors";
import { uploadPdfService } from "../services/pdfService";


// Route handler for insurance api
export const insuranceController = async (req: Request, res: Response) => {
    console.log("Upload request received");

    // No need to check for files here as validateFileUpload middleware already does this

    try {
        // Get user email from the request object (added by verifyToken middleware)
        if (!req.user || !req.user.email) {
            console.error("Upload failed: User not authenticated properly");
            return res.status(401).json({
                status: false,
                message: "User not authenticated properly",
                error: "AUTHENTICATION_ERROR"
            });
        }

        const userEmail = req.user.email;
        console.log(`Processing upload for user: ${userEmail}`);

        // upload all the pdf file to s3 bucket, passing the user's email
        const result = uploadPdfService(req.files as Express.Multer.File[], userEmail);

        // forward this request to AI backend with folder url.
        // .........this part is pending
        console.log("request sent to ai")

        return res.status(200).json({
            status: true,
            message: `${(req.files as Express.Multer.File[]).length} files uploaded successfully, you will get response over your email: ${userEmail} in some time.`
        });
    } catch (error: any) {
        console.error("Error during S3 upload:", error);
        return res.status(error.statusCode || 500).json({
            status: false,
            message: error.message || "Failed to upload files to cloud",
            error: error.code || "S3_UPLOAD_ERROR"
        });
    }
};


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

        return res.status(200).json(result);

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