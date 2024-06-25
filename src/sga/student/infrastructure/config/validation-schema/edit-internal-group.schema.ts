import * as Joi from 'joi';

export const editInternalGroupSchema = Joi.object({
  code: Joi.string().required(),
  isDefault: Joi.boolean().required(),
});
