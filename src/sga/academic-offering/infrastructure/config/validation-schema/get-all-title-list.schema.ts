import * as Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = [
  'name',
  'officialCode',
  'officialProgram',
  'officialTitle',
  'businessUnit',
];

export const getAllTitlesSchema = createCollectionSchema(orderByFields, {
  name: Joi.string().trim().optional(),
  officialCode: Joi.string().trim().optional(),
  officialProgram: Joi.string().trim().optional(),
  officialTitle: Joi.string().trim().optional(),
  businessUnit: Joi.string().trim().optional(),
});
