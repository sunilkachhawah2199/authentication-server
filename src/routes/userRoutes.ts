import { fetchUserAgentController, processInvoiceController } from "../controllers/agentController";
import { Router } from "express";


const router = Router();

// fetch agent of
router.get("/fetch-agents", fetchUserAgentController);

export default router;