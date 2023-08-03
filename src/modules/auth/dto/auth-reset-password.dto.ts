import { Forgot } from '@modules/forgot/forgot.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsExist } from '@utils/validators/is-exists.validator';
import { IsNotEmpty, Validate } from 'class-validator';
import i18n from 'src/i18n';

export class AuthResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Validate(IsExist, [Forgot.name], {
    message: i18n?.t('common.emailNotExists'),
  })
  hash: string;
}
