import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['code', 'subject', 'academicPeriod', 'block'];

export const searchInternalGroupsSchema = createCollectionSchema(
  orderByFields,
  {
    text: Joi.string().required(),
  },
);
