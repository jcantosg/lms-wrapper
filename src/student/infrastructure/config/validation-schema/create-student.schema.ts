import Joi from 'joi';

export const createStudentSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  surname: Joi.string().required(),
  surname2: Joi.string().required(),
  email: Joi.string().email().required(),
  universaeEmail: Joi.string().email().required(),
});
