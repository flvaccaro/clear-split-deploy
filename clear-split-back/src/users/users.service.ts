import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.interface';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>
  ) {}
  
  async findByEmail(email: string): Promise<User | undefined> {
    const doc = await this.userModel.findOne({ email }).exec();
    return doc?.toObject();
  }

  async create(user: Partial<User>) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async findManyByIds(ids: string[]) {
    return this.userModel
      .find({ _id: { $in: ids } })
      .select('name email bankAlias') // solo lo necesario
      .exec();
  }
}
