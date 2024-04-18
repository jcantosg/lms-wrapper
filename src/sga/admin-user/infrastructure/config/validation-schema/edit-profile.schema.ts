import Joi from 'joi';

export const editProfileSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  surname2: Joi.string().optional(),
  avatar: Joi.string().optional(),
});
