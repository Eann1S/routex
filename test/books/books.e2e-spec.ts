import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app/app.module';
import {
  createBook,
  createRandomBook,
  deleteBook,
  generateCreateBookDto,
  generateUpdateBookDto,
  getBook,
  getBooks,
  updateBook,
} from './books.e2e-utils';
import { createRandomUser } from '../auth/auth.e2e-utils';

describe('Books e2e tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create book', () => {
    it('should create a book', async () => {
      const { accessToken } = await createRandomUser(app);
      const dto = generateCreateBookDto();

      const response = await createBook(app, dto, accessToken);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(dto);
    });

    it('should create a book even if user is not authenticated', async () => {
      const dto = generateCreateBookDto();

      const response = await createBook(app, dto);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(dto);
    });
  });

  describe('Get books', () => {
    it('should get all books', async () => {
      const { accessToken } = await createRandomUser(app);
      const dto = generateCreateBookDto();
      await createBook(app, dto, accessToken);

      const response = await getBooks(app, accessToken);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([expect.objectContaining(dto)]),
      );
    });
  });

  describe('Get book', () => {
    it('should get a book', async () => {
      const { accessToken } = await createRandomUser(app);
      const dto = generateCreateBookDto();
      const book = await createBook(app, dto, accessToken);

      const response = await getBook(app, book.body.id, accessToken);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(dto);
    });
  });

  describe('Update book', () => {
    it('should update a book', async () => {
      const { accessToken } = await createRandomUser(app);
      const book = await createRandomBook(app, accessToken);
      const updateDto = generateUpdateBookDto();

      const response = await updateBook(
        app,
        book.body.id,
        updateDto,
        accessToken,
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updateDto);
    });
  });

  describe('Delete book', () => {
    it('should delete a book', async () => {
      const { accessToken } = await createRandomUser(app);
      const book = await createRandomBook(app, accessToken);

      const response = await deleteBook(app, book.body.id, accessToken);

      expect(response.status).toBe(204);
    });
  });
});
