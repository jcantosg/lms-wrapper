import Joi from 'joi';

export const getAllAcademicProgramsPlainSchema = Joi.object({
  businessUnit: Joi.string().guid().required(),
  blocksNumber: Joi.number().integer().optional().min(1),
});
