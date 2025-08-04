import { fetchUserAgentController, getUserOrganizationController, getUserProfileController } from "../controllers/userController";
import { Router } from "express";


const router = Router();

/**
 * @swagger
 * /user/fetch-agents:
 *   get:
 *     summary: Fetch user's agents
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User agents fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 agents:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Server error
 */
// fetch agent of
router.get("/fetch-agents", fetchUserAgentController);

/**
 * @swagger
 * /user/fetch-organization:
 *   get:
 *     summary: Fetch user's organization
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User organization fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 organization:
 *                   type: object
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Server error
 */
// fetch user's organization
router.get("/fetch-organization", getUserOrganizationController);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user's profile
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uuid:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 organization:
 *                   type: string
 *                 agents:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// get user's profile
router.get("/profile", getUserProfileController)

export default router;