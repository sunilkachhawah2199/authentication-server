/**
 * Custom error classes for general application errors
 */

// Base error class for all application errors
export class ApplicationError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = 'ApplicationError';
        this.statusCode = statusCode;
    }
}

// Bad request errors
export class BadRequestError extends ApplicationError {
    constructor(message: string = 'Bad request') {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}