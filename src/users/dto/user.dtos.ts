import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
  IsEmail,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class CreateUserDto extends PickType(UserDto, ['name', 'email']) {
  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  hashedPassword: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
