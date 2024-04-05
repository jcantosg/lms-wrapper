import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['name', 'code', 'officialCode'];

export const searchAcademicProgramByTitleSchema = createCollectionSchema(
  orderByFields,
  {
    text: Joi.string().required(),
  },
);

export const searchAcademicProgramByTitleIdSchema = Joi.string()
  .guid()
  .required();
