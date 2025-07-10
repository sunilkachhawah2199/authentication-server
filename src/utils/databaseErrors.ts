/**
 * Custom error classes for database-related operations
 */

// Base error class for all database-related errors
export class DatabaseError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = statusCode;
    }
}

// Query errors
export class DatabaseQueryError extends DatabaseError {
    constructor(message: string='Failed to query database') {
        super(message,500);
        this.name = 'DatabaseQueryError';
    }
}