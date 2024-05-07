import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = [
  'name',
  'title',
  'code',
  'businessUnit',
  'structureType',
  'programBlocksNumber',
];

export const getAllAcademicProgramsSchema = createCollectionSchema(
  orderByFields,
  {
    name: Joi.string().optional(),
    code: Joi.string().optional(),
    title: Joi.string().optional(),
    businessUnit: Joi.string().guid().optional(),
    structureType: Joi.string().optional(),
    programBlocksNumber: Joi.number().optional(),
  },
);
