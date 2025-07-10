import { Router } from "express";
import { pdfUpload } from "../middleware/multerMiddleware";
import { uploadPdfsHandler } from "../controllers/pdfController";

const router = Router();
router.post("/pdfs", pdfUpload.array("pdfs"), uploadPdfsHandler);

export default router;