import swaggerUi from 'swagger-ui-express';
import { app } from './index';

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Express TypeScript Server API',
      version: '1.0.0',
      description: 'API Documentation for Express TypeScript Server',
    },
  },
  apis: ['src/index.ts'],
};

const swaggerSpec = swaggerUi.setup(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerSpec);
