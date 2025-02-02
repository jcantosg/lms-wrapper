import * as Joi from 'joi';

export const generateRecoveryPasswordTokenSchema: Joi.ObjectSchema = Joi.object(
  {
    email: Joi.string().email().required(),
  },
);
