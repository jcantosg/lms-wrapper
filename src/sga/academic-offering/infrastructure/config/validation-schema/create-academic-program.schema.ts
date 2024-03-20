import Joi from 'joi';

export const createAcademicProgramSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  code: Joi.string().optional(),
  title: Joi.string().required(),
  businessUnit: Joi.string().guid().required(),
});
