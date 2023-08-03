import appConfig from '@config/app.config';
import { AppConfig } from '@config/config.type';
import { Schema, Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { generateCollectionSchema } from '@utils/generate-collection-schema';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export const FILES_COLLECTION_NAME = 'files';

@Schema({ timestamps: true, collection: FILES_COLLECTION_NAME })
export class File {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Prop({ required: true })
  path: string;

  @Exclude()
  @Prop({ required: false })
  deletedAt?: Date;
}

export type FileDoc = HydratedDocument<File>;

const FilesSchema = generateCollectionSchema(File, FILES_COLLECTION_NAME);
FilesSchema.pre('save', function (next) {
  this.path = (appConfig() as AppConfig).backendDomain + this.path;
  next();
});

export { FilesSchema };
