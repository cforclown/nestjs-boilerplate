import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { IsNotExist } from '@utils/validators/is-not-exists.validator';
import { IsExist } from '@utils/validators/is-exists.validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { ADMINS_COLLECTION_NAME } from '../admin.schema';
import { ROLES_COLLECTION_NAME } from '@modules/roles/role.schema';
import i18n from 'src/i18n';

export class CreateAdminDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, [ADMINS_COLLECTION_NAME], {
    message: i18n?.t('common.emailAlreadyExists'),
  })
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  fullname: string;

  @ApiProperty()
  @Validate(IsExist, [ROLES_COLLECTION_NAME, 'id'], {
    message: i18n?.t('common.roleNotExists'),
  })
  role?: string;
}
