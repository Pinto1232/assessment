import HapiAuthBasic from '@hapi/basic';
import { Server } from '@hapi/hapi';
import { establishMongoConnection } from '@/util/mongo';
import dogs from '.';

const server = new Server({
  port: 80,
  host: 'localhost',
});

beforeAll(async () => {
  try {
    await establishMongoConnection();

    await server.register(HapiAuthBasic);

    server.auth.strategy('duAuth', 'basic', {
      validate: () => {
        return {
          isValid: true,
          credentials: {
            id: 'testuser',
            name: 'Test User',
            scope: [
              'myService:read:dog',
              'myService:create:dog',
              'myService:write:dog',
              'myService:read:dog',
            ],
          },
        };
      },
    });
    server.auth.default('duAuth');
    await server.register(dogs);

    await server.initialize();
    await server.start();

    console.log('Server started with auth strategy configured');
  } catch (error) {
    console.error('Setup error:', error);
    throw error;
  }
});

describe('dogs endpoints', () => {
  it('creates a dog', async () => {
    try {
      // Use basic auth header
      const res = await server.inject({
        method: 'POST',
        url: '/',
        headers: {
          authorization: `Basic ${Buffer.from('testuser:password').toString(
            'base64',
          )}`,
        },
        payload: {
          name: 'Fido',
          breed: 'Labrador',
          color: 'Black',
          weight: 30,
        },
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toHaveProperty('id');
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  });
});

afterAll(async () => {
  await server.stop();
});
