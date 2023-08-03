import { Schema, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ADMINS_COLLECTION_NAME, Admin } from '@modules/admins/admin.schema';
import { Allow } from 'class-validator';
import { generateCollectionSchema } from '@utils/generate-collection-schema';
import { Exclude } from 'class-transformer';

export const FORGOT_PASSWORDS_COLLECTION_NAME = 'forgot-passwords';

@Schema({ timestamps: true, collection: FORGOT_PASSWORDS_COLLECTION_NAME })
export class Forgot {
  id: string;

  @Allow()
  @Prop()
  hash: string;

  @Allow()
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: ADMINS_COLLECTION_NAME }] })
  admin: Admin;

  @Exclude()
  @Prop({ required: false })
  deletedAt?: Date;
}

export type ForgotDoc = HydratedDocument<Forgot>;

export const ForgotSchema = generateCollectionSchema(Forgot, FORGOT_PASSWORDS_COLLECTION_NAME);
