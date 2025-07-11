import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, type Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { verifyToken } from './middleware/authMiddleware';
import pdfRoutes from './routes/pdfRoutes';

const app = express();
const port = process.env.PORT ?? 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// health check route
app.get('/health', (req: Request, res: Response) => {
    return res.status(200).json({
        message: "Health Check passed",
        status: "success",
        timestamp: new Date().toISOString()
    });
});

// Public routes --> No need to verify token
app.use("/user", authRoutes);


// Protected routes --> Middleware to verify token
app.use(verifyToken);
app.use("/upload", pdfRoutes);


app.listen(port, () => {
    console.log(`[server]: Server is Running at http://localhost:${port}`);
});