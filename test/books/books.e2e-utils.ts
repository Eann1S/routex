import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { CreateBookDto, UpdateBookDto } from '../../src/books/dto/books.dtos';
import { BookStatus } from '../../src/books/book.entity';

export async function createBook(
  app: INestApplication,
  dto: CreateBookDto,
  accessToken?: string,
) {
  return request(app.getHttpServer())
    .post('/books')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(dto);
}

export async function createRandomBook(
  app: INestApplication,
  accessToken?: string,
) {
  const dto = generateCreateBookDto();
  return createBook(app, dto, accessToken);
}

export async function getBooks(app: INestApplication, accessToken: string) {
  return request(app.getHttpServer())
    .get('/books')
    .set('Authorization', `Bearer ${accessToken}`);
}

export async function getBook(
  app: INestApplication,
  id: number,
  accessToken: string,
) {
  return request(app.getHttpServer())
    .get(`/books/${id}`)
    .set('Authorization', `Bearer ${accessToken}`);
}

export async function updateBook(
  app: INestApplication,
  id: number,
  dto: UpdateBookDto,
  accessToken: string,
) {
  return request(app.getHttpServer())
    .put(`/books/${id}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(dto);
}

export async function deleteBook(
  app: INestApplication,
  id: number,
  accessToken: string,
) {
  return request(app.getHttpServer())
    .delete(`/books/${id}`)
    .set('Authorization', `Bearer ${accessToken}`);
}

export function generateCreateBookDto(): CreateBookDto {
  return {
    title: faker.lorem.words(3),
    author: faker.person.fullName(),
    publishedYear: faker.date.past().getFullYear(),
    status: faker.helpers.arrayElement(Object.values(BookStatus)),
  };
}

export function generateUpdateBookDto(): UpdateBookDto {
  return {
    title: faker.lorem.words(3),
    publishedYear: faker.date.past().getFullYear(),
    status: faker.helpers.arrayElement(Object.values(BookStatus)),
    author: faker.person.fullName(),
  };
}
