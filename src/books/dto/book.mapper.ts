import { Book } from '../book.entity';
import { BookDto } from './books.dtos';
import { mapUserToDto } from 'src/users/dto/user.mapper';
export const mapBookToDto = (book: Book): BookDto => {
  return {
    id: book.id,
    title: book.title,
    author: mapUserToDto(book.author),
    authorId: book.author?.id,
    publishedYear: book.publishedYear,
    status: book.status,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  };
};
