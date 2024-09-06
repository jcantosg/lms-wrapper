import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = [
  'adminUser',
  'createdAt',
  'businessUnit',
  'academicPeriod',
];

export const getSubjectCallScheduleHistorySchema = createCollectionSchema(
  orderByFields,
  {
    year: Joi.number().required(),
  },
);
