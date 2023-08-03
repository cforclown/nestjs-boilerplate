import { ADMINS_COLLECTION_NAME } from '@modules/admins/admin.schema';
import { ROLES_COLLECTION_NAME } from '@modules/roles/role.schema';
import { ApiProperty } from '@nestjs/swagger';
import { lowerCaseTransformer } from '@utils/transformers/lower-case.transformer';
import { IsExist } from '@utils/validators/is-exists.validator';
import { IsNotExist } from '@utils/validators/is-not-exists.validator';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import i18n from 'src/i18n';

export class CreateAdminInvitationDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, [ADMINS_COLLECTION_NAME], {
    message: i18n?.t('common.emailAlreadyExists'),
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'role1' })
  @IsNotEmpty()
  @Validate(IsExist, [ROLES_COLLECTION_NAME, 'id'], {
    message: i18n?.t('common.roleNotExists'),
  })
  role: string;
}
