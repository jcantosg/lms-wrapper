import Joi from 'joi';

export const removeBusinessUnitFromAdminUserSchema: Joi.ObjectSchema =
  Joi.object({
    businessUnit: Joi.string().guid().required(),
  });
