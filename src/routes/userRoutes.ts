import { fetchUserAgentController } from "../controllers/agentController";
import { Router } from "express";
const router = Router();

router.get("/fetch-agents", fetchUserAgentController);

export default router;