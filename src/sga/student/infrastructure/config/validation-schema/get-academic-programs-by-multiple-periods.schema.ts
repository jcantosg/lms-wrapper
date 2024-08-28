import * as Joi from 'joi';

export const getAcademicProgramByMultiplePeriodsSchema = Joi.object({
  academicPeriods: Joi.array().items(Joi.string().guid()).required(),
  titles: Joi.array().items(Joi.string().guid()).required(),
});
