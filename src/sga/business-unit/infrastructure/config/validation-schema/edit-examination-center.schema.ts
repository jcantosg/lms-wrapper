import Joi from 'joi';

export const editExaminationCenterSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  address: Joi.string().optional().allow(''),
  isActive: Joi.boolean().required(),
  countryId: Joi.string().uuid().required(),
});
