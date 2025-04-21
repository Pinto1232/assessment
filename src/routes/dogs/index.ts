import { Plugin } from '@hapi/hapi';
import { createDogHandler } from './create-dog';
import { deleteDogHandler } from './delete-dog';
import { getAllDogsHandler } from './get-all-dogs';
import { getDogHandler } from './get-dog';
import { updateDogHandler } from './update-dog';

export const routes: Plugin<{}> = {
  register: (server) => {
    server.route([
      {
        method: 'POST',
        path: '/',
        options: {
          handler: createDogHandler,
          auth: {
            strategies: ['duAuth'],
            scope: ['myService:write:dog'],
          },
        },
      },
      {
        method: 'GET',
        path: '/',
        options: {
          handler: getAllDogsHandler,
          auth: {
            strategies: ['duAuth'],
            scope: ['myService:read:dog'],
          },
        },
      },
      {
        method: 'GET',
        path: '/{dogId}',
        options: {
          handler: getDogHandler,
          auth: {
            strategies: ['duAuth'],
            scope: ['myService:read:dog'],
          },
        },
      },
      {
        method: 'PUT',
        path: '/{dogId}',
        options: {
          handler: updateDogHandler,
          auth: {
            strategies: ['duAuth'],
            scope: ['myService:write:dog'],
          },
        },
      },
      {
        method: 'DELETE',
        path: '/{dogId}',
        options: {
          handler: deleteDogHandler,
          auth: {
            strategies: ['duAuth'],
            scope: ['myService:write:dog'],
          },
        },
      },
    ]);
  },
  name: 'dogs',
};

export default routes;
