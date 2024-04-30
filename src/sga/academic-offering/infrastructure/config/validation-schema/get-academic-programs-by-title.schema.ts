import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['name', 'code', 'officialCode'];

export const getAcademicProgramsByTitleSchema = createCollectionSchema(
  orderByFields,
  {
    name: Joi.string().optional(),
    code: Joi.string().optional(),
    officialCode: Joi.string().optional(),
  },
);

export const getAcademicProgramsByTitleIdSchema = Joi.string()
  .guid()
  .required();
