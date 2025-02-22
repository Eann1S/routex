import { Book } from '../book.entity';
import { BookDto } from './books.dtos';

export const mapBookToDto = (book: Book): BookDto => {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    publishedYear: book.publishedYear,
    status: book.status,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  };
};
