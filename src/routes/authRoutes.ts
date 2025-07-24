import { Router } from "express";
import { validateApiKey } from "../middleware/apiKeyMiddleware";
import { fetchUserAgentController, loginController, signupController } from "../controllers/authController";

const router = Router();

// Public route - accessible to all users
router.post("/login", loginController);

// Protected route - only accessible with valid API key
router.post("/signup", validateApiKey, signupController);

router.get("/fetch-agents", fetchUserAgentController);

export default router;