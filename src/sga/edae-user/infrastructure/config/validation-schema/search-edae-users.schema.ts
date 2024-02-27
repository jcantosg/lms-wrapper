import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['name', 'surname1', 'surname2', 'email', 'country'];
export const searchEdaeUsersSchema = createCollectionSchema(orderByFields, {
  text: Joi.string().trim().required(),
});
