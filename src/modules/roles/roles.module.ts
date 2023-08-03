import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { ROLES_COLLECTION_NAME, RoleSchema } from './role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ROLES_COLLECTION_NAME,
        schema: RoleSchema,
      },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService, MongooseModule],
})
export class RolesModule {}
