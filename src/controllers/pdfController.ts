import { Request, Response } from "express";
import { uploadPdfService } from "../services/pdfService";

// Route handler for PDF uploads
export const uploadPdfController = async (req: Request, res: Response): Promise<void> => {
    console.log("Upload request received");

    if (!req.files || !(req.files as Express.Multer.File[]).length) {
        console.error("Upload failed: No files received");
        res.status(400).json({ message: "No files uploaded" });
        return;
    }

    try {
        // upload all the pdf file to s3 bucket
        const result = await uploadPdfService(req.files as Express.Multer.File[]);

        // forward this request to AI backend with folder url.
        // .........this part is pending

        res.status(200).json({
            "status": "success",
            result, // it will be removed from user response once development is done
            "message": `${(req.files as Express.Multer.File[]).length} files uploaded successfully, you weill get response over mail in some time.`
        })
    } catch (error: any) {
        console.error("Error during S3 upload:", error);
        res.status(error.statusCode || 500).json({
            error: "Failed to upload files to cloud",
            message: error.message,
        });
    }
};
