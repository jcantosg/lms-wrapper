import Joi from 'joi';

export const editVirtualCampusSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  isActive: Joi.boolean().required(),
});
