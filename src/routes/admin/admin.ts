import { addAgentToUserController, createAgentController, getAllAgentController } from "../../controllers/admin/admin";
import { Router } from "express";

const router = Router();

// add new agent
router.post("/create-agent", createAgentController);
router.get("/all-agents", getAllAgentController);

// add agent to user
router.post("/add-agent", addAgentToUserController);


export default router;