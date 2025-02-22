import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { BookStatus } from '../book.entity';
import { IsOptional, IsEnum, IsString, IsNotEmpty } from 'class-validator';

export class BookDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'The Great Gatsby' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'John Doe' })
  author: string;

  @ApiProperty({ example: '1925' })
  publishedYear?: number;

  @ApiPropertyOptional({
    example: BookStatus.AVAILABLE,
    enum: BookStatus,
    default: BookStatus.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(BookStatus)
  status: BookStatus;

  @ApiProperty({ example: '2025-01-01' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01' })
  updatedAt: Date;
}

export class CreateBookDto extends PickType(BookDto, [
  'title',
  'author',
  'publishedYear',
  'status',
]) {}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
