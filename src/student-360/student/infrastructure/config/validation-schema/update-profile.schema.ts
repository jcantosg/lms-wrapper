import Joi from 'joi';
import { getAllStudentGenders } from '#shared/domain/enum/student-gender.enum';

export const updateProfileSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  surname2: Joi.string().required(),
  email: Joi.string().email().required(),
  newPassword: Joi.string().allow(null).optional(),
  avatar: Joi.string().allow(null).optional(),
  birthDate: Joi.date().allow(null).optional(),
  gender: Joi.string()
    .optional()
    .valid(...getAllStudentGenders()),
  country: Joi.string().allow(null).guid().optional(),
  citizenship: Joi.string().allow(null).guid().optional(),
  socialSecurityNumber: Joi.string().allow(null).optional(),
  phone: Joi.string().allow(null).optional(),
  contactCountry: Joi.string().allow(null).guid().optional(),
  state: Joi.string().allow(null).optional(),
  city: Joi.string().allow(null).optional(),
  address: Joi.string().allow(null).optional(),
  guardianName: Joi.string().allow(null).optional(),
  guardianSurname: Joi.string().allow(null).optional(),
  guardianEmail: Joi.string().allow(null).optional(),
  guardianPhone: Joi.string().allow(null).optional(),
});
