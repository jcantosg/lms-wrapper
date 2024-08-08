import * as Joi from 'joi';

export const getAcademicProgramByMultiplePeriodsSchema = Joi.object({
  academicPeriod: Joi.array().items(Joi.string().guid()).required(),
});
