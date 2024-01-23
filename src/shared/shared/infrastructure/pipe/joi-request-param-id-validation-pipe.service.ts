import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { StringSchema } from 'joi';

@Injectable()
export class JoiRequestParamIdValidationPipeService implements PipeTransform {
  constructor(private schema: StringSchema) {}

  transform(value: any, metadata: ArgumentMetadata): any {
    if ('param' !== metadata.type && 'id' !== metadata.data) {
      return value;
    }
    const validation = this.schema.validate(value);
    if (validation.error) {
      throw new BadRequestException(validation.error.message);
    }

    return validation.value;
  }
}
