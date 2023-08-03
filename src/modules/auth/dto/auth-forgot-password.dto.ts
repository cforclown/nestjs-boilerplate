import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsExist } from '@utils/validators/is-exists.validator';
import { ADMINS_COLLECTION_NAME } from '@modules/admins/admin.schema';
import i18n from 'src/i18n';

export class AuthForgotPasswordDto {
  @ApiProperty()
  @Transform(lowerCaseTransformer)
  @Validate(IsExist, [ADMINS_COLLECTION_NAME], {
    message: i18n?.t('common.emailNotExists'),
  })
  @IsEmail()
  email: string;
}
