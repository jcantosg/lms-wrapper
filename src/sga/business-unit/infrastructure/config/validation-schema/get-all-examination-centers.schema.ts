import * as Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = [
  'name',
  'code',
  'isActive',
  'country',
  'address',
  'createdAt',
  'updatedAt',
];

export const getAllExaminationCentersSchema = createCollectionSchema(
  orderByFields,
  {
    name: Joi.string().trim().optional(),
    code: Joi.string().trim().optional(),
    isActive: Joi.boolean().truthy('true').falsy('false').optional(),
    country: Joi.string().guid().optional(),
    businessUnit: Joi.string().trim().optional(),
    classroom: Joi.string().trim().optional(),
  },
);
