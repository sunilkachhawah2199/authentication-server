import { Request, Response, NextFunction } from 'express';

// Hardcoded API key for internal team access
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

/**
 * Middleware to validate API key for internal team routes
 * API key should be provided in the request headers as 'x-api-key'
 */
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== INTERNAL_API_KEY) {
        return res.status(403).json({
            success: false,
            message: 'Access forbidden: Invalid or missing API key'
        });
    }

    next();
}; 