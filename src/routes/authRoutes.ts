import { Router } from "express";
import { loginController, signupController } from "../controllers/userController";
import { validateApiKey } from "../middleware/apiKeyMiddleware";

const router = Router();

// Public route - accessible to all users
router.post("/login", loginController);

// Protected route - only accessible with valid API key
router.post("/signup", validateApiKey, signupController);

export default router;