import logger from "../utils/logger";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";

// Custom error handler for multer
export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction): Response | void => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        logger.error("Multer error:", err.code, err.message);
        logger.error(`Multer error:, ${err.code}, ${err.message}`);

        let statusCode = 400;
        let message = "File upload error";

        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                statusCode = 413; // Payload Too Large
                message = "File size exceeds the limit of 100 MB";
                break;
            case 'LIMIT_FILE_COUNT':
                statusCode = 400;
                message = "Too many files. Maximum 200 files allowed";
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                statusCode = 400;
                message = "Unexpected field name in form data";
                break;
            default:
                message = err.message;
        }

        return res.status(statusCode).json({
            status: false,
            message: message,
            error: err.code
        });
    } else if (err) {
        // An unknown error occurred
        logger.error("Unknown upload error:", err);
        return res.status(500).json({
            status: false,
            message: "An unexpected error occurred during file upload",
            error: "INTERNAL_SERVER_ERROR"
        });
    }

    // If no file was selected or file type validation failed
    if (req.files && Array.isArray(req.files) && req.files.length === 0 && req.headers['content-type']?.includes('multipart/form-data')) {
        return res.status(400).json({
            status: false,
            message: "No valid PDF files were uploaded. Please ensure files are in PDF format and under 2MB each.",
            error: "INVALID_FILE_TYPE"
        });
    }

    // If no error, continue to the next middleware
    next();
};

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
            logger.error(
                "File validation failed:",
                file.originalname,
                "Invalid type:",
                file.mimetype,
                "Extension:",
                fileExtension
            );
            // Instead of silently rejecting, we'll store the error for later handling
            if (!req.fileValidationErrors) {
                req.fileValidationErrors = [];
            }
            req.fileValidationErrors.push({
                filename: file.originalname,
                error: "Invalid file type. Only PDF files are allowed."
            });

            cb(null, false);
            return;
        }

        logger.error(
            "File validation passed:",
            file.originalname,
            "Type:",
            file.mimetype
        );
        return cb(null, true);
    },
    limits: {
        files: 200,
        fileSize: 50 * 1024 * 1024, // 50 MB in bytes
    },
});

// Configure multer for single CSV file upload
export const csvSingleUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        // CSV validation - check both mimetype and file extension
        const allowedMimeTypes = ["text/csv", "application/csv", "text/plain"];
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (!allowedMimeTypes.includes(file.mimetype) && fileExtension !== ".csv") {
            logger.error(
                "File validation failed:",
                file.originalname,
                "Invalid type:",
                file.mimetype,
                "Extension:",
                fileExtension
            );
            return cb(new Error("Invalid file type. Only CSV files are allowed."));
        }

        logger.info(
            "File validation passed:",
            file.originalname,
            "Type:",
            file.mimetype
        );
        return cb(null, true);
    },
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB in bytes
    },
});

// Middleware to check if any valid files were uploaded
export const validateFileUpload = (req: Request, res: Response, next: NextFunction): Response | void => {
    // If there are validation errors, return them
    if (req.fileValidationErrors && req.fileValidationErrors.length > 0) {
        return res.status(415).json({
            status: false,
            message: "One or more files have invalid format. Only PDF files are accepted.",
            errors: req.fileValidationErrors
        });
    }

    // If no files were uploaded at all
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        return res.status(400).json({
            status: false,
            message: "No files were uploaded. Please select at least one PDF file.",
            error: "NO_FILES_UPLOADED"
        });
    }

    next();
};

// Add custom type definitions
declare global {
    namespace Express {
        interface Request {
            fileValidationErrors?: Array<{
                filename: string;
                error: string;
            }>;
        }
    }
}