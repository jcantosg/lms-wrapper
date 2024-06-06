import Joi from 'joi';
import { getAllSubjectModalities } from '#academic-offering/domain/enum/subject-modality.enum';
import { getAllSubjectTypes } from '#academic-offering/domain/enum/subject-type.enum';

export const createSubjectSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  image: Joi.string().optional(),
  code: Joi.string().required(),
  hours: Joi.number().optional(),
  officialCode: Joi.string().optional(),
  modality: Joi.valid(...getAllSubjectModalities()).required(),
  evaluationType: Joi.string().guid().required(),
  type: Joi.valid(...getAllSubjectTypes()).required(),
  businessUnit: Joi.string().guid().required(),
  isRegulated: Joi.boolean().required(),
  isCore: Joi.boolean().required(),
  officialRegionalCode: Joi.string().optional(),
  lmsCourseId: Joi.number().optional(),
});
