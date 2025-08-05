import logger from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

export const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { method, originalUrl, body, headers } = req;
    const start = Date.now();

    const oldSend = res.send.bind(res);
    let responseBody: any;

    res.send = (data: any) => {
        responseBody = data;
        return oldSend(data);
    };

    res.on('finish', () => {
        const duration = Date.now() - start;

        // Create a structured log object
        const logData = {
            method,
            url: originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            requestBody: body,
            responseBody: responseBody,
            userAgent: headers['user-agent'],
            timestamp: new Date().toISOString()
        };

        // Log based on status code
        if (res.statusCode >= 400) {
            logger.error('HTTP Request Failed', logData);
        } else {
            logger.info('HTTP Request Completed', logData);
        }
    });

    next();
};