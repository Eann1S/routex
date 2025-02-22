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
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private booksRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    try {
      return await this.booksRepository.find();
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException('Books not found');
    }
  }

  async findOne(id: number): Promise<Book> {
    try {
      return await this.booksRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException('Book not found');
    }
  }

  async create(book: CreateBookDto): Promise<Book> {
    try {
      const { author, title, publishedYear, status } = book;
      return await this.booksRepository.save(
        {
          author,
          title,
          publishedYear,
          status,
        },
        { reload: true },
      );
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
      return this.findOne(id);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException('Book not found');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.booksRepository.delete(id);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException('Book not found');
    }
  }
}
