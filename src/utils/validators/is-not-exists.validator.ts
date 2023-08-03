import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

type ValidationEntity = { id?: number | string } | undefined;

@Injectable()
@ValidatorConstraint({ name: 'IsNotExist', async: true })
export class IsNotExist implements ValidatorConstraintInterface {
  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0] as string;
    const currentValue = validationArguments.object as ValidationEntity;
    const entity = (await mongoose.model(repository).findOne({
      [validationArguments.property]: value,
    })) as ValidationEntity;

    if (entity?.id === currentValue?.id) {
      return true;
    }

    return !entity;
  }
}
