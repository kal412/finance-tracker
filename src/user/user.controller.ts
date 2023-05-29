import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FilterUserDTO } from './dto/filter-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptionsHelper } from 'src/common/helper/multer-options.helper';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async getAllUsers(@Query() param: FilterUserDTO): Promise<User[]> {
    if (Object.keys(param).length) {
      return this.userService.userFilter(param);
    } else {
      return this.userService.getAll();
    }
  }

  @Post('/register')
  @UseInterceptors(
    FileInterceptor(
      'image',
      multerOptionsHelper('public/images/user', 1000000),
    ),
  )
  createUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: CreateUserDTO,
  ): Promise<User> {
    if (file) {
      createUserDto.image = file.filename;
    }
    return this.userService.create(createUserDto);
  }

  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor(
      'image',
      multerOptionsHelper('public/images/user', 1000000),
    ),
  )
  updateUser(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDTO,
  ): Promise<User> {
    if (file) {
      updateUserDto.image = file.filename;
    }
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.delete(id);
    if (!user) {
      throw new NotFoundException('User not found to delete');
    }
  }
}
