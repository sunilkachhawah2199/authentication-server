import { validateApiKey } from "../../middleware/apiKeyMiddleware";
import { addAgentToUserController, addUserInOrganizationController, createAgentController, createOrganizationController, getAllAgentController } from "../../controllers/admin/adminController";
import { Router } from "express";

const router = Router();

router.use(validateApiKey)

// add new agent
router.post("/create-agent", createAgentController);

// get all agent
router.get("/all-agents", getAllAgentController);

// add agent to user
router.post("/add-agent", addAgentToUserController);

// ---------------------- organization routes ------------------------

// create organization
router.post("/create-organization", createOrganizationController);

// add user to organization
router.post("/add-user-to-organization", addUserInOrganizationController);


export default router;