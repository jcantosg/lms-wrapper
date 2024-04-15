import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['name', 'code', 'officialCode', 'text'];

export const searchAcademicProgramByPeriodSchema = createCollectionSchema(
  orderByFields,
  {
    text: Joi.string().trim().required(),
  },
);
