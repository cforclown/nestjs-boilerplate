import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ADMINS_COLLECTION_NAME, AdminDoc } from './admin.schema';
import { NullableType } from '@utils/types/nullable.type';
import { AdminInvitationsService } from '@modules/admin-invitations/admin-invitation.service';
import { MailService } from '@modules/mail/mail.service';
import { InviteAdminDto } from './dto/invite-admin.dto';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { ChangeAdminRoleDto } from './dto/change-admin-role.dto';
import { FilterAddtionalOptions } from '@utils/filter-additional-options';
import { ROLES_COLLECTION_NAME, RoleDoc } from '@modules/roles/role.schema';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(ADMINS_COLLECTION_NAME) private adminsModel: Model<AdminDoc>,
    @InjectModel(ROLES_COLLECTION_NAME) private rolesModel: Model<RoleDoc>,
    private readonly adminInvitationsService: AdminInvitationsService,
    private readonly mailService: MailService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<AdminDoc> {
    return (
      await this.adminsModel.create({
        ...createAdminDto,
        password: await bcrypt.hash(createAdminDto.password, await bcrypt.genSalt()),
      })
    ).populate({ path: 'role', model: ROLES_COLLECTION_NAME });
  }

  findWithPagination({ page, limit }: IPaginationOptions): Promise<AdminDoc[]> {
    return this.adminsModel
      .find({})
      .populate({ path: 'role', model: this.rolesModel })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findOne(
    filter: Record<string, any>,
    additionalOptions?: FilterAddtionalOptions,
  ): Promise<NullableType<AdminDoc>> {
    const admin = await this.adminsModel
      .findOne(filter)
      .populate({ path: 'role', model: ROLES_COLLECTION_NAME })
      .exec();

    return admin && additionalOptions?.json ? admin.toJSON({ virtuals: true }) : admin;
  }

  update(id: string, payload: UpdateAdminProfileDto): Promise<NullableType<AdminDoc>> {
    return this.adminsModel.findOneAndUpdate({ _id: id }, { ...payload }, { new: true }).exec();
  }

  changeRole(payload: ChangeAdminRoleDto): Promise<NullableType<AdminDoc>> {
    return this.adminsModel.findOneAndUpdate({ _id: payload.adminId }, { role: payload.role }, { new: true }).exec();
  }

  async inviteAdmin(payload: InviteAdminDto): Promise<InviteAdminDto> {
    const { _id: invitationId, email } = await this.adminInvitationsService.create({ ...payload });
    await this.mailService.inviteAdmin({
      to: email,
      data: { invitationId: invitationId.toString() },
    });

    return payload;
  }

  async delete(id: string): Promise<void> {
    await this.adminsModel.findOneAndUpdate({ _id: id }, { status: 'inactive' });
  }
}
