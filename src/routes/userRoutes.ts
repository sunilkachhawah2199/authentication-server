import { fetchUserAgentController, getUserOrganizationController, getUserProfileController } from "../controllers/userController";
import { Router } from "express";


const router = Router();

// fetch agent of
router.get("/fetch-agents", fetchUserAgentController);

// fetch user's organization
router.get("/fetch-organization", getUserOrganizationController);

// get user's profile
router.get("/profile", getUserProfileController)

export default router;