import Joi from 'joi';

export const createVirtualCampusSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  code: Joi.string().required(),
  businessUnitId: Joi.string().guid().required(),
});
