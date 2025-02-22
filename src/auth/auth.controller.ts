import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, TokenDto } from './dto/auth.dtos';
import { mapUserToDto } from '../users/dto/user.mapper';
import { Public } from './auth.guard';
import { UserDto } from '../users/dto/user.dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The created user',
    type: UserDto,
  })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return mapUserToDto(user);
  }

  @Post('login')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'The logged in user',
    type: TokenDto,
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
