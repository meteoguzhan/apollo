import express, { Express } from 'express';
import errorHandler from './errorHandler';
import { useAuthRouter } from '../routes/authRoutes';
import { useIndexRouter } from '../routes/indexRoutes';
import { useConsumptionRouter } from '../routes/consumptionRoutes';

export async function app(port: number | string): Promise<Express> {
  const app: Express = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/auth', useAuthRouter());
  app.use('/index', useIndexRouter());
  app.use('/consumption', useConsumptionRouter());

  app.use(errorHandler);

  return new Promise<Express>((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log('Server running at http://127.0.0.1:' + port + '/');
      resolve(app);
    });

    server.on('error', (error) => {
      reject(error);
    });
  });
}
