import * as Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = ['name', 'code', 'isActive', 'country', 'address'];

export const searchExaminationCenterSchema = createCollectionSchema(
  orderByFields,
  {
    text: Joi.string().trim().required(),
  },
);
