import * as Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = ['name', 'code', 'startDate', 'endDate', 'businessUnit'];

export const getAllAcademicPeriodsSchema = createCollectionSchema(
  orderByFields,
  {
    name: Joi.string().trim().optional(),
    code: Joi.string().trim().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    businessUnit: Joi.string().trim().optional(),
  },
);
