/* eslint-disable no-console */
import { SchemaFactory } from '@nestjs/mongoose';
import { Type } from '@nestjs/common';
import { Types, Schema } from 'mongoose';
import { Colorize } from './logger';

export const generateCollectionSchema = <T>(modelSchema: Type<T>, collectionName: string): Schema => {
  const schema = SchemaFactory.createForClass<T>(modelSchema);
  schema.virtual('id').get(function () {
    return (this._id as Types.ObjectId).toHexString();
  });
  schema.pre('save', function (next) {
    if (this.isNew && this.id && !this._id) {
      this._id = typeof this.id === 'string' ? new Types.ObjectId(this.id) : this.id;
    }
    console.log(Colorize.success(`[${collectionName}]`), `${this.isNew ? 'insert' : 'update'}:`, this._id ?? '');
    next();
  });
  schema.pre('findOne', function (next) {
    const filter = this.getFilter();
    if (filter.id) {
      filter._id = filter.id;
      delete filter.id;
    }
    console.log(Colorize.success(`[${collectionName}]`), `findOne:`, filter);

    next();
  });
  schema.pre('find', function (next) {
    const filter = this.getFilter();
    if (filter.id) {
      filter._id = filter.id;
      delete filter.id;
    }
    console.log(Colorize.success(`[${collectionName}]`), `find:`, filter);

    next();
  });

  return schema;
};
