import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['name', 'surname1', 'surname2', 'email', 'country'];
export const getAllEdaeUsersSchema = createCollectionSchema(orderByFields, {
  name: Joi.string().trim().optional(),
  surname1: Joi.string().trim().optional(),
  surname2: Joi.string().trim().optional(),
  email: Joi.string().trim().optional(),
  businessUnit: Joi.string().trim().optional(),
  country: Joi.string().trim().optional(),
  roles: Joi.array().items(Joi.string().trim()).optional(),
});
