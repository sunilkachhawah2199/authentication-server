import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Wealth Authentication Server Documentation',
        version: '1.0.0',
        description: 'API documentation for wealth tools Server',
    },
    servers: [
        {
            url: 'http://localhost:4000', // Update as per your environment
        },
    ],
    components: {
        securitySchemes: {
            ApiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'x-api-key',
                description: 'API key for authentication'
            },
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'JWT token for authentication'
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: [
        './src/app.ts',                // Main app file with health route
        './src/routes/*.ts',           // Main route files
        './src/routes/**/*.ts'         // Route files in subdirectories
    ], // Path to your route files
};

export const swaggerSpec = swaggerJSDoc(options);