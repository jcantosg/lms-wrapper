import * as Joi from 'joi';

export const studentUpdatePasswordSchema: Joi.ObjectSchema = Joi.object({
  newPassword: Joi.string().required(),
  token: Joi.string().required(),
});
