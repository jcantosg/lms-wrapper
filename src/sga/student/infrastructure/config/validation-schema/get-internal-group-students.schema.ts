import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['name'];

export const getInternalGroupStudentsSchema = createCollectionSchema(
  orderByFields,
  {
    text: Joi.string().optional(),
  },
);
