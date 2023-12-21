import Joi from 'joi';

export const editBusinessUnitSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  countryId: Joi.string().guid().required(),
  isActive: Joi.boolean().required(),
});
