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
export const getInternalGroupsSchema = createCollectionSchema(orderByFields, {
  code: Joi.string().optional(),
  subject: Joi.string().optional(),
  academicProgram: Joi.string().optional(),
  academicPeriod: Joi.string().optional(),
  businessUnit: Joi.string().optional(),
  startDate: Joi.string().optional(),
});
