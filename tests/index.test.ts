import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Express } from 'express';
import { app } from '../src/utils/server';
import { SuccessResponse } from '../src/utils/successResponse';
import { IndexModel } from '../src/models/IndexModel';
import { UserModel } from '../src/models/UserModel';
import bcrypt from 'bcrypt';
import { authService } from '../src/services/authService';
import { ConsumptionModel } from '../src/models/ConsumptionModel';
import { ErrorResponse } from '../src/utils/errorResponse';

describe('index test', () => {
  let mongoServer: MongoMemoryServer;
  let appServer: Express;
  let authToken: string;

  const generateAuthToken = async () => {
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

    authToken = token;
  };

  beforeAll(async () => {
    appServer = await app(3003);
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
    await generateAuthToken();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe('index create test', () => {
    it('should not create a new index without authentication', async () => {
      const indexData = { indexValue: 123, date: '2024-01-31' };
      const res = await request(appServer).post('/index').send(indexData);
      expect(res.status).toBe(401);
    });

    it('should create a new index', async () => {
      const indexData = { indexValue: 123, date: '2024-01-31' };
      const res = await request(appServer)
        .post('/index')
        .set('Authorization', authToken)
        .send(indexData);

      const body: SuccessResponse = res.body as SuccessResponse;

      expect(res.status).toBe(200);
      expect(body.code).toBe(1003);

      const savedIndex = await IndexModel.findOne({ date: indexData.date });
      expect(savedIndex).toBeDefined();

      const savedConsumption = await ConsumptionModel.findOne();
      expect(savedConsumption).toBeNull();
    });

    it('should not create a new index with invalid data', async () => {
      const invalidIndexData = { invalidField: 'invalidValue' };
      const res = await request(appServer)
        .post('/index')
        .set('Authorization', authToken)
        .send(invalidIndexData);

      const body: ErrorResponse = res.body as ErrorResponse;

      expect(res.status).toBe(400);
      expect(body).toHaveProperty('message');
    });

    it('should create a new index and calculate the consumption', async () => {
      const indexFirstData = { indexValue: 100, date: '2024-01-01' };
      const resFirst = await request(appServer)
        .post('/index')
        .set('Authorization', authToken)
        .send(indexFirstData);
      const bodyFirst: SuccessResponse = resFirst.body as SuccessResponse;
      expect(resFirst.status).toBe(200);
      expect(bodyFirst.code).toBe(1003);

      const indexLastData = { indexValue: 500, date: '2024-01-03' };
      const resLast = await request(appServer)
        .post('/index')
        .set('Authorization', authToken)
        .send(indexLastData);
      const bodyLast: SuccessResponse = resLast.body as SuccessResponse;
      expect(resLast.status).toBe(200);
      expect(bodyLast.code).toBe(1003);

      const savedIndexes = await ConsumptionModel.find();
      expect(savedIndexes).toHaveLength(2);
      expect(savedIndexes[0]).toMatchObject({ date: '2024-01-01', consumption: 200 });
      expect(savedIndexes[1]).toMatchObject({ date: '2024-01-02', consumption: 200 });
    });
  });
});
