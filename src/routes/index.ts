import { Server } from '@hapi/hapi';
import dogs from './dogs';

export const routes = async (server: Server) => {
  await server.register(dogs, {
    routes: { prefix: '/v1.0/dogs' },
  });
};
