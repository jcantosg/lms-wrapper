import * as Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = ['name', 'code', 'country'];

export const searchAcademicPeriodSchema = createCollectionSchema(
  orderByFields,
  {
    text: Joi.string().trim().required(),
  },
);
