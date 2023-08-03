import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ADMINS_COLLECTION_NAME, AdminSchema } from '@modules/admins/admin.schema';
import { SuperAdminSeedService } from './super-admins-seed.service';
import { ROLES_COLLECTION_NAME, RoleSchema } from '@modules/roles/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ROLES_COLLECTION_NAME,
        schema: RoleSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: ADMINS_COLLECTION_NAME,
        schema: AdminSchema,
      },
    ]),
  ],
  providers: [SuperAdminSeedService],
  exports: [SuperAdminSeedService],
})
export class SuperAdminSeedModule {}
