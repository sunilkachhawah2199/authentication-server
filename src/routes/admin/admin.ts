import { validateApiKey } from "../../middleware/apiKeyMiddleware";
import { addAgentToUserController, createAgentController, getAllAgentController } from "../../controllers/admin/adminController";
import { Router } from "express";

const router = Router();

router.use(validateApiKey)

// add new agent
router.post("/create-agent", createAgentController);
router.get("/all-agents", getAllAgentController);

// add agent to user
router.post("/add-agent", addAgentToUserController);


export default router;