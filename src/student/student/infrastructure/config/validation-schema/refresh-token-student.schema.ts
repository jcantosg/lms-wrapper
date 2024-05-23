import Joi from 'joi';

export const refreshTokenStudentSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
