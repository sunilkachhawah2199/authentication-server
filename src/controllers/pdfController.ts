import { Request, Response } from "express";
import { uploadPdfService } from "../services/pdfService";

// Route handler for PDF uploads
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
