import { Module } from '@nestjs/common';
import { AdminInvitationsService } from './admin-invitation.service';
import { AdminInvitationsController } from './admin-invitation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ADMIN_INVITATIONS_COLLECTION_NAME, AdminInvitationsSchema } from './admin-invitation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ADMIN_INVITATIONS_COLLECTION_NAME,
        schema: AdminInvitationsSchema,
      },
    ]),
  ],
  controllers: [AdminInvitationsController],
  providers: [AdminInvitationsService],
  exports: [AdminInvitationsService],
})
export class AdminInvitationsModule {}
