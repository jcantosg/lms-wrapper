import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['code', 'subjectName', 'academicPeriod', 'blockName'];
export const getAllInternalGroupsSchema = createCollectionSchema(
  orderByFields,
  {
    subject: Joi.string().optional(),
    academicPeriod: Joi.string().optional(),
    code: Joi.string().optional(),
  },
);
