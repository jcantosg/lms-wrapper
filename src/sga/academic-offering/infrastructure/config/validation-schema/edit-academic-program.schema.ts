import Joi from 'joi';

export const editAcademicProgramSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  title: Joi.string().guid().required(),
});
