import { ApiProperty } from '@nestjs/swagger';
import { Schema, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Allow } from 'class-validator';
import { generateCollectionSchema } from '@utils/generate-collection-schema';
import { Exclude } from 'class-transformer';

export const RoleCapabilityActionList = ['read', 'create', 'update', 'delete'] as const;
export type RoleCapabilityCommonActionsType = (typeof RoleCapabilityActionList)[number];
export type RoleCapabilityCommonActions = { [action in RoleCapabilityCommonActionsType]?: boolean };

export const RoleCapabilityList = ['masterData', 'admins', 'roles'] as const;
export type RoleCapabilityType = (typeof RoleCapabilityList)[number];
export const isRoleCapability = (str: string): str is RoleCapabilityType => RoleCapabilityList.includes(str as any);

export type RoleCapabilities = { [capability in RoleCapabilityType]?: RoleCapabilityCommonActions };

export const ROLES_COLLECTION_NAME = 'roles';

@Schema({ timestamps: true, collection: ROLES_COLLECTION_NAME })
export class Role {
  _id: Types.ObjectId;

  @ApiProperty()
  id: string;

  @Allow()
  @ApiProperty({ example: 'Basic' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'Basic' })
  @Prop()
  desc?: string;

  @ApiProperty({
    example: {
      masterData: {
        read: true,
        create: true,
        update: false,
        delete: false,
      },
    },
  })
  @Prop({
    type: Object,
    required: false,
    default: {},
  })
  capabilities: { [capability in RoleCapabilityType]?: RoleCapabilityCommonActions };

  @ApiProperty()
  @Prop({ required: false })
  static?: boolean;

  @Exclude()
  @Prop({ required: false })
  deletedAt?: Date;
}

export type RoleDoc = HydratedDocument<Role>;

export const RoleSchema = generateCollectionSchema(Role, ROLES_COLLECTION_NAME);
