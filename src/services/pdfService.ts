import { UploadResult } from "../models/fileModel";
import { uploadFileToS3 } from "../utils/s3";

// Function to generate unique session folder
const generateSessionFolder = (): string => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const random = Math.random().toString(36).substring(2, 8);
    return `session-${timestamp}-${random}`;
};


// Service to upload PDFs to S3
export const uploadPdfService = async (files: Express.Multer.File[]): Promise<UploadResult> => {
    try {
        // Generate unique session folder for this upload
        const sessionFolder = generateSessionFolder();
        console.log(`Created session folder: ${sessionFolder}`);

        console.log(`Processing ${files.length} files for upload`);
        const uploadPromises = files.map((file) =>
            uploadFileToS3(file, sessionFolder)
        );
        const uploadedFiles = await Promise.all(uploadPromises);

        // Generate folder URL
        const folderUrl = `https://${process.env.AWS_S3_BUCKET || "insurance-bhang"
            }.s3.${process.env.AWS_REGION || "ap-south-1"
            }.amazonaws.com/${sessionFolder}`;

        console.log("Upload completed successfully");

        // Return the result to be used by the controller
        return {
            message: `${files.length} files uploaded successfully`,
            folderUrl,
            sessionFolder,
            files: uploadedFiles
        };
    } catch (error: any) {
        // Log the error for debugging
        console.error(`upload pdf error: ${error.name} - ${error.message}`);

        // Re-throw to be handled by the controller
        throw error;
    }
}