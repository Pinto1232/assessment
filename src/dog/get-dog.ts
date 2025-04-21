import { Dog } from './schema';

export const getDog = async (dogId: string) => {
  const doc = await Dog.findById(dogId);
  if (!doc) {
    return;
  }
  return {
    id: doc.id,
    name: doc.name,
    breed: doc.breed,
    color: doc.color,
    weight: doc.weight,
  };
};
