import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { SESSIONS_COLLECTION_NAME, Session, SessionDocument } from './sessions.schema';
import { NullableType } from '@utils/types/nullable.type';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(SESSIONS_COLLECTION_NAME)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async findOne(options: FilterQuery<Session>): Promise<NullableType<SessionDocument>> {
    return this.sessionModel
      .findOne({ ...options })
      .populate('admin')
      .exec();
  }

  async findMany(options: FilterQuery<Session>): Promise<SessionDocument[]> {
    return this.sessionModel
      .find({ ...options })
      .populate('admin')
      .exec();
  }

  async create(data: Partial<Session>): Promise<SessionDocument> {
    return (await this.sessionModel.create(data)).populate('admin');
  }

  async deleteByAdminId(adminId: string, excludeId?: string): Promise<void> {
    await this.sessionModel
      .deleteOne({
        admin: adminId,
        _id: excludeId
          ? {
              $ne: excludeId,
            }
          : undefined,
      })
      .exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.sessionModel.deleteOne({ _id: id }).exec();
  }
}
