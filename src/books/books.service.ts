import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
      return this.booksRepository.find({ relations: ['author'] });
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to find books');
    }
  }

  async findOne(id: number): Promise<Book> {
    try {
      return this.booksRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to find book');
    }
  }

  async create(book: CreateBookDto): Promise<Book> {
    try {
      const { authorId, title, publishedYear, status } = book;
      return this.booksRepository.save({
        authorId,
        title,
        publishedYear,
        status,
      });
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create book');
    }
  }

  async update(id: number, book: UpdateBookDto): Promise<Book> {
    try {
      await this.booksRepository.update(id, book);
      return this.findOne(id);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update book');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.booksRepository.delete(id);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to delete book');
    }
  }
}
