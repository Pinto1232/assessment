import { Dog, IDog } from './schema';

export const updateDog = async (
  dogId: string,
  updates: Partial<Omit<IDog, 'id' | 'createdAt' | 'updatedAt'>>,
) => {
  const doc = await Dog.findByIdAndUpdate(dogId, updates, { new: true });
  if (!doc) {
    return null;
  }
  return {
    id: doc.id,
    name: doc.name,
    breed: doc.breed,
    color: doc.color,
    weight: doc.weight,
  };
};
