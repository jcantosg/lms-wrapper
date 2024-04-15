import Joi from 'joi';

export const createProgramBlockSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  academicProgramId: Joi.string().guid().required(),
});
