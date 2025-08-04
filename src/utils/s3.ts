import { UploadedFile } from "../models/fileModel";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Configure AWS S3
export const s3 = new S3Client({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

// Function to upload file to S3
export const uploadFileToS3 = async (
    file: Express.Multer.File,
    sessionFolder: string
): Promise<UploadedFile> => {
    try {
        const key = `${sessionFolder}/${file.originalname}`;

        const params = {
            // Bucket: process.env.AWS_S3_BUCKET || "insurance-extractor",
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        return {
            originalName: file.originalname,
            location: `https://${params.Bucket}.s3.${process.env.AWS_REGION || "ap-south-1"
                }.amazonaws.com/${key}`,
            sizeKB: (file.size / 1024).toFixed(2),
        };
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw new Error(`Failed to upload ${file.originalname} to S3`);
    }
};