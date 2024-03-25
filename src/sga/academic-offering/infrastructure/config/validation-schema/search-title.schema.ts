import * as Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = ['name', 'code', 'officialCode', 'businessUnit'];

export const searchTitleSchema = createCollectionSchema(orderByFields, {
  text: Joi.string().trim().required(),
});
