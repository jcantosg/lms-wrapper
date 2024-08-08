import * as Joi from 'joi';

export const getStudentsByBuPeriodsAndProgramsSchema = Joi.object({
  businessUnitIds: Joi.array().items(Joi.string().uuid()).required(),
  academicPeriodIds: Joi.array().items(Joi.string().uuid()).required(),
  academicProgramIds: Joi.array().items(Joi.string().uuid()).required(),
});
