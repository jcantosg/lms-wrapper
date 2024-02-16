import * as Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = ['name', 'surname', 'email'];

export const getAllAdminUsersSchema = createCollectionSchema(orderByFields, {
  name: Joi.string().trim().optional(),
  surname: Joi.string().trim().optional(),
  email: Joi.string().optional(),
  businessUnit: Joi.string().optional(),
  role: Joi.string().optional(),
});
