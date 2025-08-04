import logger from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

export const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { method, originalUrl, body } = req;
    const start = Date.now();

    const oldSend = res.send.bind(res);
    let responseBody: any;

    res.send = (data: any) => {
        responseBody = data;
        return oldSend(data);
    };

    res.on('finish', () => {
        const duration = Date.now() - start;

        // Format response body for better readability
        let formattedResponse = responseBody;
        try {
            // Try to parse as JSON and format it nicely
            if (typeof responseBody === 'string') {
                const parsed = JSON.parse(responseBody);
                formattedResponse = JSON.stringify(parsed, null, 2);
            } else if (typeof responseBody === 'object') {
                formattedResponse = JSON.stringify(responseBody, null, 2);
            }
        } catch (error) {
            // If it's not valid JSON, keep it as is
            formattedResponse = responseBody;
        }

        logger.info(`
            --- REQUEST ---
            Method: ${method}
            URL: ${originalUrl}
            Body: ${JSON.stringify(body, null, 2)}

            --- RESPONSE ---
            Status: ${res.statusCode}
            Response: ${formattedResponse}
            Duration: ${duration}ms
            `);
    });

    next();
};