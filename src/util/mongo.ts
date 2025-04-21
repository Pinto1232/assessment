import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect } from 'mongoose';

export const establishMongoConnection = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await connect(uri);
};
