import Joi from 'joi';

export const editProgramBlockSchema = Joi.object({
  name: Joi.string().required(),
});
