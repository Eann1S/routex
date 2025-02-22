import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { generateRegisterDto, loginUser, registerUser } from './auth.e2e-utils';
import { AppModule } from '../../src/app/app.module';
import { TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('Auth tests', () => {
  let app: INestApplication;
  let cache: Cache;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    cache = app.get<Cache>(CACHE_MANAGER);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await cache.clear();
  });

  describe('Register', () => {
    it('should register a new user', async () => {
      const dto = generateRegisterDto();

      const response = await registerUser(app, dto);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        email: dto.email,
        name: dto.name,
      });
    });

    it('should return 400 if user already exists', async () => {
      const dto = generateRegisterDto();
      await registerUser(app, dto);

      const response = await registerUser(app, dto);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        message: 'User already exists',
      });
    });
  });

  describe('Login', () => {
    it('should login a user', async () => {
      const dto = generateRegisterDto();
      await registerUser(app, dto);

      const response = await loginUser(app, dto);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        access_token: expect.any(String),
      });
    });

    it('should return 404 if user does not exist', async () => {
      const response = await loginUser(app, {
        email: 'nonexistent@example.com',
        password: 'password',
      });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        message: 'Failed to find user by email',
      });
    });

    it('should return 401 if password is incorrect', async () => {
      const dto = generateRegisterDto();

      await registerUser(app, dto);

      const response = await loginUser(app, {
        email: dto.email,
        password: 'incorrect',
      });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        message: 'Invalid credentials',
      });
    });
  });
});
