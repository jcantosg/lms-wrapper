import * as Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = ['name', 'surname', 'email'];

export const searchAdminUsersSchema = createCollectionSchema(orderByFields, {
  text: Joi.string().trim().required(),
});
