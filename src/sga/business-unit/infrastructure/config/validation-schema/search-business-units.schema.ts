import * as Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = ['name', 'code', 'isActive', 'country'];

export const searchBusinessUnitSchema = createCollectionSchema(orderByFields, {
  text: Joi.string().trim().required(),
});
