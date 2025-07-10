import { Router } from "express";
import { pdfUpload } from "../middleware/multerMiddleware";
import { uploadPdfController } from "../controllers/pdfController";

const router = Router();
router.post("/pdfs", pdfUpload.array("pdfs"), uploadPdfController);

export default router;