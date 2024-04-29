import * as Joi from 'joi';

export const getAcademicPeriodsByBusinessUnitSchema = Joi.object({
  businessUnit: Joi.string().guid().required(),
});
