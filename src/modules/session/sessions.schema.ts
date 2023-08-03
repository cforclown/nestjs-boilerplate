import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ADMINS_COLLECTION_NAME, Admin } from '@modules/admins/admin.schema';
import { generateCollectionSchema } from '@utils/generate-collection-schema';

export const SESSIONS_COLLECTION_NAME = 'sessions';

@Schema({ timestamps: true, collection: SESSIONS_COLLECTION_NAME })
export class Session {
  id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ADMINS_COLLECTION_NAME })
  admin: Admin;

  @Prop({ required: false })
  deletedAt?: Date;
}

export type SessionDocument = HydratedDocument<Session>;

export const SessionSchema = generateCollectionSchema(Session, SESSIONS_COLLECTION_NAME);
