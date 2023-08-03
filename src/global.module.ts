import { Module, Global } from '@nestjs/common';
import { RolesService } from '@modules/roles/roles.service';
import { RolesModule } from '@modules/roles/roles.module';

@Global()
@Module({
  imports: [RolesModule],
  providers: [RolesService],
  exports: [RolesService],
})
export class GlobalModule {}
