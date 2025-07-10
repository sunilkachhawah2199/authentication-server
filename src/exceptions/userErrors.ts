/**
 * Custom error classes for user-related operations
 */

// Base error class for all user-related errors
export class UserError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'UserError';
    }
}


// User already exists error
export class UserExistsError extends UserError {
    constructor(message: string = 'User already exists') {
        super(message, 400);
        this.name = 'UserExistsError';
    }
}

// Invalid credentials error
export class InvalidCredentialsError extends UserError {
    constructor(message: string = 'Invalid email or password') {
        super(message, 401);
        this.name = 'InvalidCredentialsError';
    }
} 