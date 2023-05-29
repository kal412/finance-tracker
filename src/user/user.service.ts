import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './schemas/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { FilterUserDTO } from './dto/filter-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async create(createUserDto: CreateUserDTO): Promise<User> {
    const userName = await this.userRepository.findOne({
      username: createUserDto.username,
    });
    if (userName) {
      throw new BadRequestException('Username already exist');
    }
    const userEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    if (userEmail) {
      throw new BadRequestException('Email already exist');
    }
    return await this.userRepository.create(createUserDto);
  }

  userFilter(filterUserDto: FilterUserDTO) {
    return this.userRepository.findWithFilters(filterUserDto);
  }

  getUserById(id: string): Promise<User> {
    const user = this.userRepository.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  updateUser(id: string, updateUserDto: UpdateUserDTO): Promise<User> {
    return this.userRepository.update(id, updateUserDto);
  }

  async delete(id: string): Promise<boolean> {
    const ret = this.userRepository.delete(id);
    return ret;
  }
}
