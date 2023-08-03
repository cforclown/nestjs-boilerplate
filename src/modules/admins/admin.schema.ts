import { Schema, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Exclude } from 'class-transformer';
import uniqueValidator from 'mongoose-unique-validator';
import { ROLES_COLLECTION_NAME, Role } from '@modules/roles/role.schema';
import { File } from '@modules/files/file.schema';
import { generateCollectionSchema } from '@utils/generate-collection-schema';
import { ApiProperty } from '@nestjs/swagger';

export const ADMINS_COLLECTION_NAME = 'admins';

@Schema({ timestamps: true, collection: ADMINS_COLLECTION_NAME })
export class Admin {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  email: string;

  @Exclude()
  @Prop()
  password: string;

  @Exclude()
  @Prop()
  previousPassword?: string;

  @ApiProperty()
  @Prop({ required: true })
  fullname: string;

  @ApiProperty()
  @Prop({ required: false })
  photo?: File;

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ROLES_COLLECTION_NAME })
  role: Role;

  @Exclude()
  @Prop({ default: 'active' })
  status: 'active' | 'inactive';
}

export type AdminDoc = HydratedDocument<Admin>;

const AdminSchema = generateCollectionSchema(Admin, ADMINS_COLLECTION_NAME);
AdminSchema.plugin(uniqueValidator);

export { AdminSchema };
