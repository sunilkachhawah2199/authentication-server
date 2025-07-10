import { Request, Response } from "express";
import multer from "multer";
import path from "path";

// Configure multer with memory storage and file validation
export const pdfUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        // Track files for limit checking
        if (!req.files) {
            (req as any).files = [];
        }

        // PDF validation - check both mimetype and file extension
        const allowedMimeTypes = ["application/pdf"];
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (!allowedMimeTypes.includes(file.mimetype) || fileExtension !== ".pdf") {
            console.error(
                "File validation failed:",
                file.originalname,
                "Invalid type:",
                file.mimetype,
                "Extension:",
                fileExtension
            );
            cb(null, false);
            return;
        }

        console.log(
            "File validation passed:",
            file.originalname,
            "Type:",
            file.mimetype
        );
        return cb(null, true);
    },
    limits: {
        files: 200,
        fileSize: 20 * 1024 * 1024, // 20MB in bytes
    },
});