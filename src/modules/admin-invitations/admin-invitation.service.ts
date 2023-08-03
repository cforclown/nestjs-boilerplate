import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateAdminInvitationDto } from './dto/create-admin-invitation.dto';
import { ADMIN_INVITATIONS_COLLECTION_NAME, AdminInvitationDoc } from './admin-invitation.schema';
import { NullableType } from '@utils/types/nullable.type';
import { generateHash } from '@utils/generate-hash';

@Injectable()
export class AdminInvitationsService {
  constructor(
    @InjectModel(ADMIN_INVITATIONS_COLLECTION_NAME)
    private readonly adminInvitationsModel: Model<AdminInvitationDoc>,
  ) {}

  async create(createAdminInvitationDto: CreateAdminInvitationDto): Promise<AdminInvitationDoc> {
    const hash = generateHash();
    return (
      await this.adminInvitationsModel.create({
        ...createAdminInvitationDto,
        hash,
      })
    ).populate('role');
  }

  findAll() {
    return this.adminInvitationsModel.find({}).populate('role').exec();
  }

  findOne(payload: FilterQuery<AdminInvitationDoc>): Promise<NullableType<AdminInvitationDoc>> {
    return this.adminInvitationsModel.findOne(payload).populate('role').exec();
  }

  async delete(id: string): Promise<NullableType<string>> {
    const result = await this.adminInvitationsModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 0 ? null : id;
  }
}
