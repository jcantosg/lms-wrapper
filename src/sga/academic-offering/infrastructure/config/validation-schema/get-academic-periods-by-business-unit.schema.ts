import * as Joi from 'joi';

export const getAcademicPeriodsByBusinessUnitSchema = Joi.object({
  businessUnitIds: Joi.array().items(Joi.string().uuid()).required(),
});
