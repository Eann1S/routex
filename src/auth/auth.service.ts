import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { JwtPayloadDto, LoginDto, RegisterDto } from './dto/auth.dtos';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { password, email, name } = dto;
    const hashedPassword = await argon2.hash(password);
    const user = await this.usersService.create({
      email,
      name,
      hashedPassword,
    });
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateCredentials(dto.email, dto.password);
    const payload = { email: user.email, sub: user.id, name: user.name };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: +(process.env.JWT_EXPIRES_IN || '3600'),
    });
    return {
      access_token,
    };
  }

  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (await argon2.verify(user.hashedPassword, password)) {
      return user;
    }
    throw new BadRequestException('Invalid credentials');
  }

  async validateToken(token?: string) {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayloadDto>(token, {
        secret: process.env.JWT_SECRET,
      });
      return payload;
    } catch (e) {
      Logger.error(e);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
