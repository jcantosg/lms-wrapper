import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['name', 'code', 'officialCode'];

export const getAllAcademicProgramsSchema = createCollectionSchema(
  orderByFields,
  {
    name: Joi.string().optional(),
    code: Joi.string().optional(),
    titleOfficialCode: Joi.string().optional(),
    title: Joi.string().optional(),
    businessUnit: Joi.string().guid().optional(),
  },
);
