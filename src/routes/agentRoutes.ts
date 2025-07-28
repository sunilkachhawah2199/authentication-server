import { processInvoiceController, insuranceController } from "../controllers/agentController";
import { Router } from "express";
import { csvSingleUpload, handleMulterError } from "../middleware/multerMiddleware";
import { pdfUpload, validateFileUpload } from "../middleware/multerMiddleware";

const router = Router();

// insurance agent
router.post("/insurance",
    (req, res, next) => pdfUpload.array("pdfs")(req, res, (err) => handleMulterError(err, req, res, next)),
    validateFileUpload,
    insuranceController
);

// invoice agent
router.post("/invoice",
    csvSingleUpload.single('csv'),
    handleMulterError,
    processInvoiceController
);

export default router;