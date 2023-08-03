import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Colorize } from '@utils/logger';

@Injectable()
@ValidatorConstraint({ name: 'IsExist', async: true })
export class IsExist implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate(value: string, args: ValidationArguments) {
    const modelName = args.constraints[0];
    const pathToProperty = args.constraints[1];
    const result = await this.connection.models[modelName].findOne({
      [pathToProperty ?? args.property]: pathToProperty ? value?.[pathToProperty] : value,
    });
    // eslint-disable-next-line no-console
    console.log(Colorize.success('[IsExist]'), Colorize.success(`[${modelName}]`), pathToProperty, value);

    return Boolean(result);
  }
}
