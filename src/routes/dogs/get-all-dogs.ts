import { Lifecycle } from '@hapi/hapi';
import { getAllDogs } from '../../dog/get-all-dogs';

export const getAllDogsHandler: Lifecycle.Method = async () => {
  return await getAllDogs();
};
