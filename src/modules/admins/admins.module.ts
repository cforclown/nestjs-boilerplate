import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { ADMINS_COLLECTION_NAME, AdminSchema } from './admin.schema';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminInvitationsModule } from '@modules/admin-invitations/admin-invitation.module';
import { MailModule } from '@modules/mail/mail.module';
import { RolesModule } from '@modules/roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ADMINS_COLLECTION_NAME,
        schema: AdminSchema,
      },
    ]),
    RolesModule,
    AdminInvitationsModule,
    MailModule,
  ],
  controllers: [AdminsController],
  providers: [IsExist, IsNotExist, AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
