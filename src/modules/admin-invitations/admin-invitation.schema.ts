import { ROLES_COLLECTION_NAME, Role } from '@modules/roles/role.schema';
import { Schema, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { generateCollectionSchema } from '@utils/generate-collection-schema';

export const ADMIN_INVITATIONS_COLLECTION_NAME = 'admin-invitations';

@Schema({ timestamps: true, collection: ADMIN_INVITATIONS_COLLECTION_NAME })
export class AdminInvitation {
  id: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ROLES_COLLECTION_NAME })
  role: Role;
}

export type AdminInvitationDoc = HydratedDocument<AdminInvitation>;

export const AdminInvitationsSchema = generateCollectionSchema(AdminInvitation, ADMIN_INVITATIONS_COLLECTION_NAME);
