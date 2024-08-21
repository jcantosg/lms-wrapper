import * as Joi from 'joi';

export const getAcademicPeriodsBySingleBusinessUnitSchema = Joi.object({
  businessUnit: Joi.string().uuid().required(),
});
