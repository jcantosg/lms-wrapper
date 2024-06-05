import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = [
  'code',
  'subject',
  'academicProgram',
  'academicPeriod',
  'businessUnit',
  'startDate',
];

export const searchInternalGroupsByPeriodSchema = createCollectionSchema(
  orderByFields,
  {
    text: Joi.string().required(),
  },
);