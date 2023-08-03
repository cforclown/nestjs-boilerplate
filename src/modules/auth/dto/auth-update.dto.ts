import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength, Validate } from 'class-validator';
import { IsExist } from '@utils/validators/is-exists.validator';
import { File } from '@modules/files/file.schema';
import i18n from 'src/i18n';

export class AuthUpdateDto {
  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsNotEmpty({ message: `Fullname ${i18n?.t('common.mustBeNotEmpty')}` })
  fullname?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  oldPassword: string;

  @ApiProperty({ type: () => File })
  @IsOptional()
  @Validate(IsExist, [File.name, 'id'], {
    message: i18n?.t('common.imageNotExists'),
  })
  photo?: File;
}
