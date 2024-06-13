import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = [
  'code',
  'subjectName',
  'academicProgram',
  'academicPeriod',
  'busniessUnit',
  'startDate',
];

export const searchInternalGroupsSchema = createCollectionSchema(
  orderByFields,
  {
    text: Joi.string().required(),
  },
);
