import { fetchUserAgentController, processInvoiceController } from "../controllers/agentController";
import { Router } from "express";
import { csvSingleUpload, handleMulterError } from "../middleware/multerMiddleware";
import { pdfUpload, validateFileUpload } from "../middleware/multerMiddleware";
import { insuranceController } from "../controllers/pdfController";


const router = Router();

// fetch agent of
router.get("/fetch-agents", fetchUserAgentController);

export default router;