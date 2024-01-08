import * as Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = ['name', 'code', 'isActive', 'country'];

export const getAllBusinessUnitSchema = createCollectionSchema(orderByFields, {
  name: Joi.string().trim().optional(),
  code: Joi.string().trim().optional(),
  isActive: Joi.boolean().truthy('true').falsy('false').optional(),
  country: Joi.string().guid().optional(),
});
