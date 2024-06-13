import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = [
  'code',
  'subjectName',
  'academicProgram',
  'businessUnit',
  'startDate',
];
export const getInternalGroupsByPeriodSchema = createCollectionSchema(
  orderByFields,
  {
    code: Joi.string().optional(),
    subject: Joi.string().optional(),
    academicProgram: Joi.string().optional(),
    businessUnit: Joi.string().optional(),
    startDate: Joi.string().optional(),
  },
);
