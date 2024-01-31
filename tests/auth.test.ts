import mongoose from 'mongoose';
import request from 'supertest';
import { UserModel } from '../src/models/UserModel';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Express } from 'express';
import { app } from '../src/utils/server';
import { SuccessResponse } from '../src/utils/successResponse';
import bcrypt from 'bcrypt';

describe('auth test', () => {
  let mongoServer: MongoMemoryServer;
  let appServer: Express;

  beforeAll(async () => {
    appServer = await app(3001);
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  describe('auth register test', () => {
    it('should register a new user', async () => {
      const user = { email: 'test@example.com', password: 'password', companyName: 'Test Company' };
      const res = await request(appServer).post('/auth/register').send(user);
      const body: SuccessResponse = res.body as SuccessResponse;

      expect(res.status).toBe(200);
      expect(body.code).toBe(1000);
      expect(body.data).toHaveProperty('token');

      const savedUser = await UserModel.findOne({ email: user.email });
      expect(savedUser).toBeDefined();
      expect(savedUser?.password).not.toBe(user.password);
    });

    it('should return a 400 error with validation errors for invalid user data', async () => {
      const invalidUser = { email: 'invalid@email', password: '123' };
      const res = await request(appServer).post('/auth/register').send(invalidUser);

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message');
    });

    it('should return a 400 error if a user with the same email already exists', async () => {
      const existingUser = {
        email: 'test@example.com',
        password: 'anotherpassword',
        companyName: 'Test',
      };
      await request(appServer).post('/auth/register').send(existingUser);
      const res = await request(appServer).post('/auth/register').send(existingUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should store the hashed password, not the plain text password', async () => {
      const user = { email: 'test@example.com', password: 'password', companyName: 'Test Company' };
      await request(appServer).post('/auth/register').send(user);

      const savedUser = await UserModel.findOne({ email: user.email });
      expect(savedUser?.password).not.toBe(user.password);
    });
  });

  describe('auth login test', () => {
    it('should successfully log in a user with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password',
      };
      await new UserModel({
        email: loginData.email,
        password: await bcrypt.hash(loginData.password, 10),
        companyName: 'Test Company',
      }).save();

      const res = await request(appServer).post('/auth/login').send(loginData);
      const body: SuccessResponse = res.body as SuccessResponse;

      expect(res.status).toBe(200);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('token');
    });

    it('should return a 400 error with validation errors for invalid user data', async () => {
      const invalidUser = { email: 'invalid@email' };
      const res = await request(appServer).post('/auth/login').send(invalidUser);

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('message');
    });

    it('should return a 401 error for invalid credentials', async () => {
      const invalidLogin = { email: 'test@example.com', password: 'wrongpassword' };
      const res = await request(appServer).post('/auth/login').send(invalidLogin);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });
});
