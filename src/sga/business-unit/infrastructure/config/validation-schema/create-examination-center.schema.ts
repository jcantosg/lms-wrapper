import Joi from 'joi';

export const createExaminationCenterSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().required().guid(),
  name: Joi.string().required(),
  code: Joi.string().required(),
  businessUnits: Joi.array().items(Joi.string().guid()).required(),
  address: Joi.string().required(),
  countryId: Joi.string().guid().required(),
});
