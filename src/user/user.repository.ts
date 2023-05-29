import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { FilterUserDTO } from './dto/filter-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}
  async create(createUserDto: CreateUserDTO): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    return await newUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOne(query: any): Promise<User> {
    return await this.userModel.findOne(query);
  }

  async findWithFilters(filter: FilterUserDTO) {
    const username = Object.is(filter.username, undefined)
      ? ''
      : filter.username;
    const email = Object.is(filter.email, undefined) ? '' : filter.email;
    return await this.userModel.find({
      $and: [{ username: { $regex: username } }, { email: { $regex: email } }],
    });
  }

  async update(id: string, user: UpdateUserDTO): Promise<User> {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      {
        image: user.image,
        expenditureBudget: user.expenditureBudget,
      },
    );
  }

  async delete(id: string): Promise<boolean> {
    const objectId = new mongoose.Types.ObjectId(id);
    const ret = await this.userModel.deleteOne({ _id: objectId });
    return ret.deletedCount === 1;
  }
}
