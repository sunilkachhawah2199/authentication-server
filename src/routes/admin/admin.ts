import { validateApiKey } from "../../middleware/apiKeyMiddleware";
import { addAgentToUserController, addUserInOrganizationController, createAgentController, createOrganizationController, getAllAgentController } from "../../controllers/admin/adminController";
import { Router } from "express";

const router = Router();

router.use(validateApiKey)

/**
 * @swagger
 * /admin/create-agent:
 *   post:
 *     summary: Create a new agent
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - host
 *               - apiKey
 *               - description
 *               - tags
 *               - icon
 *             properties:
 *               name:
 *                 type: string
 *                 enum: [INSURANCE, INVOICE]
 *                 description: Type of agent
 *               host:
 *                 type: string
 *                 description: Agent host URL
 *               apiKey:
 *                 type: string
 *                 description: API key for the agent
 *               description:
 *                 type: string
 *                 description: Agent description
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Agent tags
 *               icon:
 *                 type: string
 *                 description: Agent icon URL
 *     responses:
 *       200:
 *         description: Agent created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
// add new agent
router.post("/create-agent", createAgentController);

/**
 * @swagger
 * /admin/all-agents:
 *   get:
 *     summary: Get all agents
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: All agents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
// get all agent
router.get("/all-agents", getAllAgentController);

/**
 * @swagger
 * /admin/add-agent:
 *   post:
 *     summary: Add agent to user
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - agentId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               agentId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Agent ID to assign
 *     responses:
 *       200:
 *         description: Agent added to user successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
// add agent to user
router.post("/add-agent", addAgentToUserController);

// ---------------------- organization routes ------------------------

/**
 * @swagger
 * /admin/create-organization:
 *   post:
 *     summary: Create a new organization
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - logo
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Organization name
 *               logo:
 *                 type: string
 *                 description: Organization logo URL
 *               description:
 *                 type: string
 *                 description: Organization description
 *     responses:
 *       200:
 *         description: Organization created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
// create organization
router.post("/create-organization", createOrganizationController);

/**
 * @swagger
 * /admin/add-user-to-organization:
 *   post:
 *     summary: Add user to organization
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - orgId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               orgId:
 *                 type: string
 *                 description: Organization ID
 *     responses:
 *       200:
 *         description: User added to organization successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid API key
 *       500:
 *         description: Server error
 */
// add user to organization
router.post("/add-user-to-organization", addUserInOrganizationController);


export default router;