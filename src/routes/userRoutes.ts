import { Router } from "express";
import { fetchUserAgentController } from "../controllers/authController";

const router = Router();

router.get("/fetch-agents", fetchUserAgentController);

export default router;