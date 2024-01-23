import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema, ArraySchema } from 'joi';

@Injectable()
export class JoiRequestQueryParamValidationPipeService
  implements PipeTransform
{
  constructor(private schema: ObjectSchema | ArraySchema) {}

  transform(value: any, metadata: ArgumentMetadata): any {
    if ('query' !== metadata.type) {
      return value;
    }

    const validation = this.schema.validate(value);
    if (validation.error) {
      throw new BadRequestException(validation.error.message);
    }

    return validation.value;
  }
}
