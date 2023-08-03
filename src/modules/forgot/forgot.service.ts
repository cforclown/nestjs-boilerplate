import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { FORGOT_PASSWORDS_COLLECTION_NAME, Forgot } from './forgot.schema';
import { NullableType } from '@utils/types/nullable.type';

@Injectable()
export class ForgotService {
  constructor(
    @InjectModel(FORGOT_PASSWORDS_COLLECTION_NAME)
    private readonly forgotModel: Model<Forgot>,
  ) {}

  async findOne(filter: FilterQuery<Forgot>): Promise<NullableType<Forgot>> {
    return this.forgotModel.findOne({ ...filter });
  }

  async findMany(filter: FilterQuery<Forgot>): Promise<Forgot[]> {
    return this.forgotModel.find({ ...filter });
  }

  async create(data: Omit<Forgot, 'id'>): Promise<Forgot> {
    return this.forgotModel.create(data);
  }

  async delete(id: string): Promise<void> {
    await this.forgotModel.deleteOne({ _id: id });
  }
}
