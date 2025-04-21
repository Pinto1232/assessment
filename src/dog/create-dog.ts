import { Dog, IDog } from './schema';

export const createDog = async (
  dogData: Omit<IDog, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const doc = new Dog(dogData);
  await doc.save();
  return {
    id: doc.id,
    name: doc.name,
    breed: doc.breed,
    color: doc.color,
    weight: doc.weight,
  };
};
