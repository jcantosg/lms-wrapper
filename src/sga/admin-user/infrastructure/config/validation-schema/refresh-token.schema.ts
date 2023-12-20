import * as Joi from 'joi';

export const refreshTokenSchema: Joi.ObjectSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
