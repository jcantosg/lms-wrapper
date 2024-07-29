import Joi from 'joi';
import { getAllStudentGenders } from '#shared/domain/enum/student-gender.enum';
import { getAccessQualification } from '#shared/domain/enum/access-qualification.enum';

export const editStudentSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  surname2: Joi.string().required(),
  email: Joi.string().email().required(),
  universaeEmail: Joi.string().email().required(),
  isActive: Joi.boolean().required(),
  avatar: Joi.string().optional().allow(''),
  birthDate: Joi.date().optional(),
  gender: Joi.string()
    .valid(...getAllStudentGenders())
    .optional(),
  country: Joi.string().guid().optional(),
  citizenship: Joi.string().guid().optional().allow(''),
  identityDocument: Joi.object({
    identityDocumentType: Joi.string().required(),
    identityDocumentNumber: Joi.string().required(),
  }).optional(),
  socialSecurityNumber: Joi.string().optional().allow(''),
  accessQualification: Joi.string()
    .valid(...getAccessQualification())
    .optional()
    .allow(''),
  niaIdalu: Joi.string().optional().allow(''),
  phone: Joi.string().optional().allow(''),
  contactCountry: Joi.string().guid().optional(),
  state: Joi.string().optional().allow(''),
  city: Joi.string().optional().allow(''),
  address: Joi.string().optional().allow(''),
  guardianName: Joi.string().optional().allow(''),
  guardianSurname: Joi.string().optional().allow(''),
  guardianEmail: Joi.string().optional().allow(''),
  guardianPhone: Joi.string().optional().allow(''),
  isDefense: Joi.boolean().required(),
});
