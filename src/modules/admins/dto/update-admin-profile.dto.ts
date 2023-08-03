import { PartialType, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, MinLength, Validate } from 'class-validator';
import { CreateAdminDto } from './create-admin.dto';
import { IsNotExist } from '@utils/validators/is-not-exists.validator';
import { File } from '@modules/files/file.schema';
import { IsExist } from '@utils/validators/is-exists.validator';
import { lowerCaseTransformer } from '@utils/transformers/lower-case.transformer';
import i18n from 'src/i18n';
import { ADMINS_COLLECTION_NAME } from '../admin.schema';

export class UpdateAdminProfileDto extends PartialType(CreateAdminDto) {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @Validate(IsNotExist, [ADMINS_COLLECTION_NAME], {
    message: i18n?.t('commom.emailAlreadyExists'),
  })
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  fullname?: string;

  @ApiProperty({ type: () => File })
  @IsOptional()
  @Validate(IsExist, ['files', '_id'], {
    message: i18n?.t('commom.imageNotExists'),
  })
  photo?: File;
}
