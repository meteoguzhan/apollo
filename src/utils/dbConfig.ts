import mongoose from 'mongoose';

export default async function connectMongo(mongoURI: string | undefined) {
  if (!mongoURI) {
    throw new Error('MongoDB connection error: MONGO_URI is not defined');
  }

  try {
    await mongoose.connect(mongoURI);
  } catch (error) {
    throw error;
  }

  return mongoose;
}
