import { AiProcessRequest, UploadResult } from "../models/fileModel";
import { uploadFileToS3 } from "../utils/s3";
import { extractorService } from "./agentService";

// Function to generate unique session folder
const generateSessionFolder = (): string => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const random = Math.random().toString(36).substring(2, 8);
    return `session-${timestamp}-${random}`;
};


// Service to upload PDFs to S3
export const uploadPdfService = async (files: Express.Multer.File[], userEmail: string): Promise<UploadResult> => {
    try {
        // Generate unique session folder for this upload
        const sessionFolder = generateSessionFolder();
        // console.log(`Created session folder: ${sessionFolder}`);

        // console.log(`Processing ${files.length} files for upload`);
        const uploadPromises = files.map((file) =>
            uploadFileToS3(file, sessionFolder)
        );
        const uploadedFiles = await Promise.all(uploadPromises);

        // Generate folder URL
        const folderUrl = `https://${process.env.AWS_S3_BUCKET || "insurance-bhang"
            }.s3.${process.env.AWS_REGION || "ap-south-1"
            }.amazonaws.com/${sessionFolder}`;

        // console.log("Upload completed successfully");

        const requestBody: AiProcessRequest = {
            email: userEmail, // Use the email from the authenticated user
            folderUrl: folderUrl
        }

        // Try to call the extractor service, but don't let failures stop the upload process
        try {
            await extractorService(requestBody);
            // console.log("AI extractor service called successfully");
        } catch (error) {
            // console.error("Error calling AI extractor service, but continuing:", error);
            // Continue processing - don't fail the upload if the extractor service fails
        }

        // Return the result to be used by the controller
        return {
            message: `${files.length} files uploaded successfully`,
            folderUrl,
            sessionFolder,
            files: uploadedFiles
        };
    } catch (error: any) {
        // Log the error for debugging
        // console.error(`Upload pdf error: ${error.name} - ${error.message}`);

        // Re-throw to be handled by the controller
        throw error;
    }
}