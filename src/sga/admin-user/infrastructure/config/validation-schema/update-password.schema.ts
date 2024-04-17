import * as Joi from 'joi';

export const updatePasswordSchema: Joi.ObjectSchema = Joi.object({
  newPassword: Joi.string().required(),
  token: Joi.string().required(),
});
