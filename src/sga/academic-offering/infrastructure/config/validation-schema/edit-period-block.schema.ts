import Joi from 'joi';

export const editPeriodBlockSchema = Joi.object({
  startDate: Joi.date().required(),
});
