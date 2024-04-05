import Joi from 'joi';

export const getAllAcademicProgramsPlainSchema = Joi.object({
  businessUnit: Joi.string().guid().required(),
});
