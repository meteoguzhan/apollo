import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Express } from 'express';
import { app } from '../src/utils/server';
import { SuccessResponse } from '../src/utils/successResponse';
import { UserInterface, UserModel } from '../src/models/UserModel';
import bcrypt from 'bcrypt';
import { authService } from '../src/services/authService';
import { ConsumptionModel } from '../src/models/ConsumptionModel';

describe('consumption test', () => {
  let mongoServer: MongoMemoryServer;
  let appServer: Express;
  let authToken: string;
  let authUser: UserInterface;

  const generateAuthTokenAndUser = async () => {
    const testUser = {
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10),
      companyName: 'Test Company',
    };

    const user = await new UserModel(testUser).save();
    const token = authService.generateToken(user);

    if (!token) {
      throw new Error('Failed to generate authentication token');
    }

    authUser = user;
    authToken = token;
  };

  beforeAll(async () => {
    appServer = await app(3002);
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
    await generateAuthTokenAndUser();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe('consumption list test', () => {
    it('should not list consumptions without authentication', async () => {
      const res = await request(appServer).get('/consumption');
      expect(res.status).toBe(401);
    });

    it('should list consumptions', async () => {
      await new ConsumptionModel({
        consumption: 200,
        date: '2024-01-01',
        userId: authUser._id,
      }).save();
      await new ConsumptionModel({
        consumption: 200,
        date: '2024-01-02',
        userId: authUser._id,
      }).save();

      const res = await request(appServer).get('/consumption').set('Authorization', authToken);
      expect(res.status).toBe(200);

      const body: SuccessResponse = res.body as SuccessResponse;
      const dataArray = body.data as Array<{ date: string; consumption: number }>;

      expect(dataArray).toHaveLength(2);

      expect(dataArray[1]).toStrictEqual({ date: '2024-01-01', consumption: 200 });
      expect(dataArray[0]).toStrictEqual({ date: '2024-01-02', consumption: 200 });
    });
  });
});
