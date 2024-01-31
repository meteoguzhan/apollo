import connectMongo from './utils/dbConfig';
import { config } from 'dotenv';
import { app } from './utils/server';

void (async () => {
  try {
    config();
    await connectMongo(process.env.MONGO_URI);
    await app(process.env.PORT ?? 3000);
  } catch (error) {
    console.error('Error connecting to MongoDB or starting the server:', error);
  }
})();
