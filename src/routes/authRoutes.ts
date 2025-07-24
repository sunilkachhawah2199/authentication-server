import { Router } from "express";
import { validateApiKey } from "../middleware/apiKeyMiddleware";
import { loginController, signupController } from "../controllers/authController";

const router = Router();

// Public route - accessible to all users
router.post("/login", loginController);

// Protected route - only accessible with valid API key
router.post("/signup", validateApiKey, signupController);

export default router;