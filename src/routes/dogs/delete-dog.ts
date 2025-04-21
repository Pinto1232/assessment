import Boom from '@hapi/boom';
import { Lifecycle } from '@hapi/hapi';
import { deleteDog } from '../../dog/delete-dog';

export const deleteDogHandler: Lifecycle.Method = async ({
  params: { dogId },
}) => {
  try {
    const deleted = await deleteDog(dogId);
    if (!deleted) {
      throw Boom.notFound('Dog not found');
    }
    return { success: true };
  } catch (e) {
    throw Boom.internal();
  }
};
