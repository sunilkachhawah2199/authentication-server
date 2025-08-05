import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, type Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { verifyToken } from './middleware/authMiddleware';
import adminRoutes from './routes/admin/admin';
import agentRoutes from './routes/agentRoutes';
import userRoutes from './routes/userRoutes';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger';
import logger from './utils/logger';
import { logMiddleware } from './middleware/loggerMiddleware';


const app = express();
const port = process.env.PORT ?? 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Swagger Route
// Mount Swagger only in non-production environments
if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// health check route
/**
 * @swagger
 * /health:
 *   get:
 *     summary: health check endpoint
 *     responses:
 *       200:
 *         description: Greeting message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (req: Request, res: Response) => {
    return res.status(200).json({
        message: "Health Check passed",
        status: "success",
        timestamp: new Date().toISOString()
    });
});

app.use(logMiddleware)
// Public routes --> No need to verify token
app.use("/auth", authRoutes);


// agent route
app.use("/admin", adminRoutes);

// Protected routes --> Middleware to verify token
app.use(verifyToken);
app.use("/agent", agentRoutes);
app.use("/user", userRoutes);


app.listen(port, () => {
    logger.info(`[server]: Server is Running at http://localhost:${port}`);
});