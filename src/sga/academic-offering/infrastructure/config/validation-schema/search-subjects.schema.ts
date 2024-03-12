import * as Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = ['name', 'code', 'officialCode'];

export const searchSubjectsSchema = createCollectionSchema(orderByFields, {
  text: Joi.string().trim().required(),
});
