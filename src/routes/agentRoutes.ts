import { createAgentController, getAllAgentController } from "../controllers/agentController";
import { Router } from "express";

const router = Router();

// add new agent
router.post("/create", createAgentController);
router.get("/all", getAllAgentController);


export default router;