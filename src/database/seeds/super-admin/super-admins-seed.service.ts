import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ADMINS_COLLECTION_NAME, AdminDoc } from '@modules/admins/admin.schema';
import {
  ROLES_COLLECTION_NAME,
  RoleCapabilityActionList,
  RoleCapabilityList,
  RoleDoc,
} from '@modules/roles/role.schema';

@Injectable()
export class SuperAdminSeedService {
  constructor(
    @InjectModel(ROLES_COLLECTION_NAME)
    private rolesModel: Model<RoleDoc>,
    @InjectModel(ADMINS_COLLECTION_NAME)
    private adminsModel: Model<AdminDoc>,
  ) {}

  async run(superAdminEmail: string, superAdminPassword: string) {
    const superAdminRoleId = new Types.ObjectId();

    try {
      if (await this.adminsModel.findOne({ email: superAdminEmail })) {
        throw new Error('Admin with this email already exists.');
      }

      const capabilities = RoleCapabilityList.reduce((acc, curr) => {
        acc[curr] = RoleCapabilityActionList.reduce((a, c) => {
          a[c] = true;
          return a;
        }, {});

        return acc;
      }, {});
      const role = await this.rolesModel.create({
        id: superAdminRoleId,
        name: 'Super Admin',
        desc: 'Super Admin. This role cannot be deleted',
        static: true,
        capabilities,
      });
      await this.adminsModel.create({
        fullname: 'Super Admin',
        email: superAdminEmail,
        password: await bcrypt.hash(superAdminPassword, await bcrypt.genSalt()),
        role: role.id,
      });
    } catch (err) {
      Logger.error(err.message);
    }
  }
}
