import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema, ArraySchema } from 'joi';

@Injectable()
export class JoiRequestBodyValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema | ArraySchema) {}

  transform(value: any, metadata: ArgumentMetadata): any {
    if ('body' !== metadata.type) {
      return value;
    }

    const { error } = this.schema.validate(value, { abortEarly: false });
    if (error) {
      throw new BadRequestException(error);
    }

    return value;
  }
}
