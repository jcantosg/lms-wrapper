import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['name', 'code', 'officialCode'];

export const getAcademicProgramsByTitleSchema =
  createCollectionSchema(orderByFields);

export const getAcademicProgramsByTitleIdSchema = Joi.string()
  .guid()
  .required();
