import Joi from 'joi';

export const generateRecoveryPasswordTokenSchema = Joi.object({
  email: Joi.string().email().required(),
});
