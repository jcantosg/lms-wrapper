import * as Joi from 'joi';

export const getCountriesSchema: Joi.ObjectSchema = Joi.object({
  filter: Joi.string().valid('examinationCenter', 'businessUnit').optional(),
});
