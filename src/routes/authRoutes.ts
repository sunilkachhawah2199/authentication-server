import { Router } from "express";
import { loginController, signupController } from "../controllers/userController";

const router = Router();
router.post("/login", loginController);

router.post("/signup", signupController);

export default router;