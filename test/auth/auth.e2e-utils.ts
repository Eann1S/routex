import { LoginDto, RegisterDto } from '../../src/auth/dto/auth.dtos';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserDto } from '../../src/users/dto/user.dtos';

export async function registerUser(app: INestApplication, dto: RegisterDto) {
  return request(app.getHttpServer()).post('/auth/register').send(dto);
}

export async function loginUser(app: INestApplication, dto: LoginDto) {
  return request(app.getHttpServer()).post('/auth/login').send(dto);
}

export async function createRandomUser(app: INestApplication) {
  const dto = generateRegisterDto();
  const user = await registerUser(app, dto);
  const loginDto = {
    email: dto.email,
    password: dto.password,
  };
  const loginResponse = await loginUser(app, loginDto);
  return {
    accessToken: loginResponse.body.access_token,
    user: user.body as UserDto,
  };
}

export function generateRegisterDto(): RegisterDto {
  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
  };
}
