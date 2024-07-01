import Joi from 'joi';

export const refreshTokenEdaeUserSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
