import Boom from '@hapi/boom';
import { Lifecycle } from '@hapi/hapi';
import { z } from 'zod';
import { updateDog } from '../../dog/update-dog';

const payloadSchema = z
  .object({
    name: z.string().optional(),
    breed: z.string().optional(),
    color: z.string().optional(),
    weight: z.number().optional(),
  })
  .strict();

export const updateDogHandler: Lifecycle.Method = async (request) => {
  let payload;
  try {
    payload = payloadSchema.parse(request.payload);
  } catch (e: any) {
    throw Boom.badRequest('Validation error', e.issues);
  }

  const { dogId } = request.params;

  try {
    const updatedDog = await updateDog(dogId, payload);
    if (!updatedDog) {
      throw Boom.notFound('Dog not found');
    }
    return updatedDog;
  } catch (e) {
    throw Boom.internal();
  }
};
