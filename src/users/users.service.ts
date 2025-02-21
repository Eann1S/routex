import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/user.dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (e) {
      Logger.error(e);
      throw new BadRequestException('Failed to find users');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      return this.usersRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      Logger.error(e);
      throw new BadRequestException('Failed to find user');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return this.usersRepository.findOneOrFail({ where: { email } });
    } catch (e) {
      Logger.error(e);
      throw new BadRequestException('Failed to find user by email');
    }
  }

  async exists(email: string): Promise<boolean> {
    return this.usersRepository.exists({ where: { email } });
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      const { hashedPassword, email, name } = user;
      const newUser = this.usersRepository.create({
        email,
        hashedPassword,
        name,
      });
      return this.usersRepository.save(newUser);
    } catch (e) {
      Logger.error(e);
      throw new BadRequestException('Failed to create user');
    }
  }

  async update(id: number, user: User): Promise<User> {
    try {
      await this.usersRepository.update(id, user);
      return this.usersRepository.findOneOrFail({ where: { id } });
    } catch (e) {
      Logger.error(e);
      throw new BadRequestException('Failed to update user');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.usersRepository.delete(id);
    } catch (e) {
      Logger.error(e);
      throw new BadRequestException('Failed to delete user');
    }
  }
}
