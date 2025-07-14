import { Router } from "express";
import { pdfUpload, handleMulterError, validateFileUpload } from "../middleware/multerMiddleware";
import { uploadPdfController } from "../controllers/pdfController";

const router = Router();

// Use the error handling middleware chain
router.post("/pdfs",
    (req, res, next) => pdfUpload.array("pdfs")(req, res, (err) => handleMulterError(err, req, res, next)),
    validateFileUpload,
    uploadPdfController
);

export default router;