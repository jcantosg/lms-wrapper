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

    const validation = this.schema.validate(value, { abortEarly: false });
    if (validation.error) {
      throw new BadRequestException(validation.error.message);
    }

    return validation.value;
  }
}
