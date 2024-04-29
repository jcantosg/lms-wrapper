import * as Joi from 'joi';

export const getAllBusinessUnitPlainSchema = Joi.object({
  hasAcademicPeriods: Joi.boolean().optional().default(false),
});
