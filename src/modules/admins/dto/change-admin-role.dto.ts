import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsExist } from '@utils/validators/is-exists.validator';
import { ROLES_COLLECTION_NAME, Role } from '@modules/roles/role.schema';
import { ADMINS_COLLECTION_NAME, Admin } from '../admin.schema';
import i18n from 'src/i18n';

export class ChangeAdminRoleDto {
  @ApiProperty({ type: Admin })
  @Validate(IsExist, [ADMINS_COLLECTION_NAME, 'id'], {
    message: i18n?.t('commom.adminNotExists'),
  })
  adminId: string;

  @ApiProperty({ type: Role })
  @Validate(IsExist, [ROLES_COLLECTION_NAME, 'id'], {
    message: i18n?.t('commom.roleNotExists'),
  })
  role: string;
}
