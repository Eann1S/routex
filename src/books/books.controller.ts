import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  HttpCode,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BookDto, CreateBookDto, UpdateBookDto } from './dto/books.dtos';
import { mapBookToDto } from './dto/book.mapper';
import { Public } from '../auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
@ApiBearerAuth()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({
    status: 200,
    description: 'The list of books',
    type: BookDto,
    isArray: true,
  })
  async findAll(): Promise<BookDto[]> {
    const books = await this.booksService.findAll();
    return books.map(mapBookToDto);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a book by id' })
  @ApiResponse({
    status: 200,
    description: 'The book',
    type: BookDto,
  })
  async findOne(@Param('id') id: string): Promise<BookDto> {
    const book = await this.booksService.findOne(+id);
    return mapBookToDto(book);
  }

  @Post()
  @Public()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({
    status: 201,
    description: 'The created book',
    type: BookDto,
  })
  async create(@Body() book: CreateBookDto): Promise<BookDto> {
    const newBook = await this.booksService.create(book);
    return mapBookToDto(newBook);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a book' })
  @ApiResponse({
    status: 200,
    description: 'The updated book',
    type: BookDto,
  })
  async update(
    @Param('id') id: string,
    @Body() book: UpdateBookDto,
  ): Promise<BookDto> {
    const updatedBook = await this.booksService.update(+id, book);
    return mapBookToDto(updatedBook);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a book' })
  @ApiResponse({
    status: 204,
    description: 'The book has been deleted',
  })
  async delete(@Param('id') id: number): Promise<void> {
    await this.booksService.delete(id);
  }
}
