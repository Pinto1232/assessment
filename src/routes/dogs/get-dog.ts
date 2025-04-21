import Boom from '@hapi/boom';
import { Lifecycle } from '@hapi/hapi';
import { getDog } from '../../dog/get-dog';

export const getDogHandler: Lifecycle.Method = async ({
  params: { dogId },
}) => {
  let dog;
  try {
    dog = await getDog(dogId);
  } catch (e) {
    throw Boom.internal();
  }

  if (!dog) {
    throw Boom.notFound('Dog not found');
  }

  return dog;
};
