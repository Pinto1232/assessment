import HapiAuthBasic from '@hapi/basic';
import Boom from '@hapi/boom';
import Hapi, { Request, ResponseToolkit } from '@hapi/hapi';
import mongoose from 'mongoose';
import { routes } from './routes';
import { establishMongoConnection } from './util/mongo';

const PORT = process.env.PORT || 80;
const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['*'];

interface AppCredentials {
  id: string;
  name: string;
  scope: string[];
}

const server = Hapi.server({
  port: PORT,
  routes: {
    cors: {
      origin: CORS_ORIGINS,
    },
    validate: {
      failAction: (request: Request, h: ResponseToolkit, err?: Error) => {
        console.error('Validation Error:', err?.message, err);
        if (err) {
          throw Boom.badRequest(`Invalid request input: ${err.message}`);
        }
        throw Boom.badRequest('Invalid request input');
      },
    },
  },
});

server.ext('onPreResponse', (request, h) => {
  const response = request.response;

  if (Boom.isBoom(response)) {
    return h.continue;
  }

  if (
    response.source !== null &&
    (typeof response.source === 'object' || typeof response.source === 'string')
  ) {
    return h.response(response.source).type('application/json');
  }

  return h.continue;
});

const registerAuthStrategies = async () => {
  await server.register(HapiAuthBasic);
  console.log('@hapi/basic plugin registered.');

  server.auth.strategy('duAuth', 'basic', {
    validate: (
      request: Request,
      username: string,
      password?: string,
    ): { isValid: boolean; credentials: AppCredentials | null } => {
      console.log(`Attempting 'duAuth' validation for user: ${username}`);

      let isValid = false;
      let userId = '';
      let userName = '';
      let userScopes: string[] = [];

      try {
        if (username === 'testuser' && password === 'password') {
          isValid = true;
          userId = 'user-123';
          userName = 'Test User';
          userScopes = [
            'myService:read:dog',
            'myService:create:dog',
            'myService:write:dog',
            'myService:read:dog',
          ];
        }
      } catch (authError) {
        console.error('Authentication error:', authError);
        isValid = false;
      }

      if (!isValid) {
        console.warn(`Authentication failed for user: ${username}`);
        return { isValid: false, credentials: null };
      }

      const credentials: AppCredentials = {
        id: userId || 'unknown-user-id',
        name: userName || 'Unknown User',
        scope: userScopes,
      };

      console.log(`Authentication successful for user: ${username}`);
      return { isValid: true, credentials };
    },
  });

  console.log("Authentication strategy 'duAuth' registered.");
};

const startServer = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await establishMongoConnection();
    console.log('MongoDB connection established successfully.');

    console.log('Registering authentication strategies...');
    await registerAuthStrategies();

    server.route({
      method: 'GET',
      path: '/',
      options: {
        auth: false,
      },
      handler: (request: Request, h: ResponseToolkit) => {
        return h
          .response({ status: 'API is running', version: '1.0.0' })
          .type('application/json');
      },
    });
    console.log('Registered root route GET /');

    console.log('Registering application routes...');
    await routes(server);
    console.log('Application routes registered.');

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
    console.log(`CORS enabled for origins: ${CORS_ORIGINS.join(', ')}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

const shutdown = async () => {
  console.log('Stopping server...');
  try {
    await server.stop({ timeout: 10000 });
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
    console.log('Server stopped.');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

const handleSignal = (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  shutdown().catch((err) => {
    console.error('Error during shutdown triggered by signal:', err);
    process.exit(1);
  });
};

process.on('SIGINT', () => handleSignal('SIGINT'));
process.on('SIGTERM', () => handleSignal('SIGTERM'));

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();

export { server };
