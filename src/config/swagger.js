const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StackOverStay Mobile API',
      version: '1.0.0',
      description: 'API documentation for the StackOverStay mobile application backend',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            code: { type: 'integer' },
            message: { type: 'string' },
          },
        },
        // Standard Response Wrapper
        StandardResponse: {
          type: 'object',
          properties: {
            code: { type: 'integer', example: 0 },
            message: { type: 'string', example: 'ok' },
            data: { type: 'object' },
            meta: { type: 'object' },
          },
        },
      },
    },
  },
  // Path to the API docs
  apis: ['./src/routes/*.js'], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;
