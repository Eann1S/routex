import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dtos';
import { BookStatus } from '../book.entity';
import {
  IsOptional,
  IsEnum,
  IsNumber,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class BookDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'The Great Gatsby' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @ApiProperty({
    example: { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  })
  author: UserDto;

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
  'authorId',
  'publishedYear',
  'status',
]) {}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
