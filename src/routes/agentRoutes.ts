import { processInvoiceController, insuranceController } from "../controllers/agentController";
import { Router } from "express";
import { csvSingleUpload, handleMulterError } from "../middleware/multerMiddleware";
import { pdfUpload, validateFileUpload } from "../middleware/multerMiddleware";

const router = Router();

/**
 * @swagger
 * /agent/insurance:
 *   post:
 *     summary: Upload insurance documents for processing
 *     tags: [Agent]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: agentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the insurance agent
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdfs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: PDF files to upload (max 200 files, 50MB each)
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request or missing agent ID
 *       401:
 *         description: User not authenticated
 *       413:
 *         description: File too large
 *       415:
 *         description: Invalid file format
 *       500:
 *         description: Server error
 */
// insurance agent
router.post("/insurance",
    (req, res, next) => pdfUpload.array("pdfs")(req, res, (err) => handleMulterError(err, req, res, next)),
    validateFileUpload,
    insuranceController
);

/**
 * @swagger
 * /agent/invoice:
 *   post:
 *     summary: Process invoice with CSV file
 *     tags: [Agent]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: agentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the invoice agent
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               csv:
 *                 type: string
 *                 format: binary
 *                 description: CSV file to process (max 100MB)
 *     responses:
 *       200:
 *         description: Invoice processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request or missing file
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Server error
 */
// invoice agent
router.post("/invoice",
    csvSingleUpload.single('csv'),
    handleMulterError,
    processInvoiceController
);

export default router;