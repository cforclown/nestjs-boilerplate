import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ROLES_COLLECTION_NAME, Role, RoleDoc } from './role.schema';
import { FilterQuery, Model } from 'mongoose';
import { NullableType } from '@utils/types/nullable.type';
import i18n from 'src/i18n';
import Cache from '@utils/Cache';

@Injectable()
export class RolesService {
  constructor(@InjectModel(ROLES_COLLECTION_NAME) private rolesModel: Model<RoleDoc>) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleDoc> {
    const role = await this.rolesModel.create({ ...createRoleDto });

    return role;
  }

  findAll(): Promise<Role[]> {
    return this.rolesModel.find({}).exec();
  }

  /**
   * This function return json object or null if not found in cache or db
   * dont mutate the return value of this function because its a pure json object.
   * @param id role id
   * @returns json object of role or null
   */
  async findById(id: string): Promise<NullableType<Role>> {
    let role: NullableType<Role> = Cache.get(id);
    if (!role) {
      role = await this.rolesModel.findById(id).exec();
      if (role) {
        role = (role as RoleDoc).toJSON({ virtuals: true });
        Cache.set(role.id, role);
      }
    }

    return role;
  }

  findOne(filter: FilterQuery<Role>): Promise<NullableType<RoleDoc>> {
    return this.rolesModel.findOne(filter).exec();
  }

  update(id: string, updateRoleDto: UpdateRoleDto): Promise<NullableType<RoleDoc>> {
    return this.rolesModel.findOneAndUpdate({ _id: id }, { ...updateRoleDto }, { new: true }).exec();
  }

  async delete(id: string): Promise<string> {
    const role = await this.rolesModel.findById(id).exec();
    if (role?.static) {
      throw new UnprocessableEntityException(i18n?.t('common.cannotDeleteStaticRole'));
    }
    await this.rolesModel.findOneAndUpdate({ _id: id }, { deletedAt: new Date() }).exec();

    return id;
  }
}
