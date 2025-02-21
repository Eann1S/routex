import { User } from '../user.entity';
import { UserDto } from './user.dtos';

export function mapUserToDto(user: User): UserDto | null {
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
