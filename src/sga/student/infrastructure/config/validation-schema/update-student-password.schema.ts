import Joi from 'joi';

export const updateStudentPasswordSchema = Joi.object({
  newPassword: Joi.string().required(),
});
