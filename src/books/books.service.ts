import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto, UpdateBookDto } from './dto/books.dtos';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class BooksService {
  private readonly cacheKeys = {
    allBooks: 'books',
    singleBook: (id: number) => `book:${id}`,
  };

  constructor(
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<Book[]> {
    try {
      const cachedBooks = await this.cacheManager.get<Book[]>(
        this.cacheKeys.allBooks,
      );
      if (cachedBooks) {
        return cachedBooks;
      }
      const books = await this.booksRepository.find();
      await this.cacheManager.set(this.cacheKeys.allBooks, books);
      return books;
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException('Books not found');
    }
  }

  async findOne(id: number): Promise<Book> {
    try {
      const cacheKey = this.cacheKeys.singleBook(id);
      const cachedBook = await this.cacheManager.get<Book>(cacheKey);
      if (cachedBook) return cachedBook;

      const book = await this.booksRepository.findOneOrFail({ where: { id } });
      await this.cacheManager.set(cacheKey, book);
      return book;
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException('Book not found');
    }
  }

  async create(book: CreateBookDto): Promise<Book> {
    try {
      const { author, title, publishedYear, status } = book;
      const newBook = await this.booksRepository.save(
        {
          author,
          title,
          publishedYear,
          status,
        },
        { reload: true },
      );
      await this.cacheManager.del(this.cacheKeys.allBooks);
      return newBook;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create book');
    }
  }

  async update(id: number, book: UpdateBookDto): Promise<Book> {
    try {
      const { author, title, publishedYear, status } = book;
      await this.booksRepository.update(id, {
        author,
        title,
        publishedYear,
        status,
      });
      await this.cacheManager.del(this.cacheKeys.allBooks);

      const updatedBook = await this.findOne(id);
      await this.cacheManager.set(this.cacheKeys.singleBook(id), updatedBook);
      return updatedBook;
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException('Book not found');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.booksRepository.delete(id);
      await this.cacheManager.del(this.cacheKeys.allBooks);
      await this.cacheManager.del(this.cacheKeys.singleBook(id));
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException('Book not found');
    }
  }
}
