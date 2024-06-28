import Joi from 'joi';

export const generateRecoveryPasswordTokenSchema = Joi.object({
  universaeEmail: Joi.string().email().required(),
});
