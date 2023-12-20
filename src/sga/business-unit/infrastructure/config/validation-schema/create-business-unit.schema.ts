import * as Joi from 'joi';

export const createBusinessUnitSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  code: Joi.string().required(),
  countryId: Joi.string().guid().required(),
});
