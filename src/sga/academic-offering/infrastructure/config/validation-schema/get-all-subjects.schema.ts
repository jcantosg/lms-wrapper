import * as Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import { getAllSubjectModalities } from '#academic-offering/domain/enum/subject-modality.enum';
import { getAllSubjectTypes } from '#academic-offering/domain/enum/subject-type.enum';

const orderByFields = [
  'name',
  'code',
  'officialCode',
  'modality',
  'type',
  'businessUnit',
];

export const getAllSubjectsSchema = createCollectionSchema(orderByFields, {
  name: Joi.string().trim().optional(),
  code: Joi.string().trim().optional(),
  officialCode: Joi.string().trim().optional(),
  modality: Joi.valid(...getAllSubjectModalities()).optional(),
  type: Joi.valid(...getAllSubjectTypes()).optional(),
  evaluationType: Joi.string().guid().optional(),
  businessUnit: Joi.string().trim().optional(),
  isRegulated: Joi.boolean().optional(),
});
