import { Dog } from './schema';

export const getAllDogs = async () => {
  const docs = await Dog.find();
  return docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    breed: doc.breed,
    color: doc.color,
    weight: doc.weight,
  }));
};
