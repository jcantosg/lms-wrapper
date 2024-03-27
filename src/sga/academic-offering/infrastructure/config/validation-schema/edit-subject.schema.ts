import Joi from 'joi';
import { getAllSubjectModalities } from '#academic-offering/domain/enum/subject-modality.enum';
import { getAllSubjectTypes } from '#academic-offering/domain/enum/subject-type.enum';

export const editSubjectSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  hours: Joi.number().required(),
  officialCode: Joi.string().optional(),
  image: Joi.string().optional(),
  modality: Joi.string()
    .valid(...getAllSubjectModalities())
    .required(),
  evaluationType: Joi.string().guid().optional(),
  type: Joi.string()
    .valid(...getAllSubjectTypes())
    .required(),
  isRegulated: Joi.boolean().required(),
  isCore: Joi.boolean().required(),
  officialRegionalCode: Joi.string().optional(),
});
