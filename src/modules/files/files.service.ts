import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FILES_COLLECTION_NAME, FileDoc } from './file.schema';
import { AllConfigType } from 'src/config/config.type';
import i18n from 'src/i18n';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FILES_COLLECTION_NAME)
    private readonly filesModel: Model<FileDoc>,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  uploadFile(file: Express.Multer.File | Express.MulterS3.File): Promise<FileDoc> {
    if (!file) {
      throw new UnprocessableEntityException(i18n?.t('common.selectFile'));
    }

    const path = {
      local: `/${this.configService.get('app.apiPrefix', { infer: true })}/v1/${file.path}`,
      s3: (file as Express.MulterS3.File).location,
    };

    return this.filesModel.create({
      path: path[this.configService.getOrThrow('file.driver', { infer: true })],
    });
  }
}
