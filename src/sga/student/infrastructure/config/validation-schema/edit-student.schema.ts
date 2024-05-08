import Joi from 'joi';
import { getAllStudentGenders } from '#student/domain/enum/student-gender.enum';
import { getAccessQualification } from '#student/domain/enum/access-qualification.enum';

export const editStudentSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  surname2: Joi.string().required(),
  email: Joi.string().email().required(),
  universaeEmail: Joi.string().email().required(),
  isActive: Joi.boolean().required(),
  avatar: Joi.string().optional,
  birthDate: Joi.date().optional(),
  gender: Joi.string()
    .valid(...getAllStudentGenders())
    .optional(),
  country: Joi.string().guid().optional(),
  citizenship: Joi.string().guid().optional(),
  identityDocument: Joi.object({
    identityDocumentType: Joi.string().required(),
    identityDocumentNumber: Joi.string().required(),
  }).optional(),
  socialSecurityNumber: Joi.string().optional(),
  accessQualification: Joi.string()
    .valid(...getAccessQualification())
    .optional(),
  niaIdalu: Joi.string().optional(),
  phone: Joi.string().optional(),
  contactCountry: Joi.string().guid().optional(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  address: Joi.string().optional(),
  guardianName: Joi.string().optional(),
  guardianSurname: Joi.string().optional(),
  guardianEmail: Joi.string().optional(),
  guardianPhone: Joi.string().optional(),
});
