import Joi from 'joi';

export const addBusinessUnitsToAdminUserSchema: Joi.ObjectSchema = Joi.object({
  businessUnits: Joi.array().items(Joi.string().guid()).min(1).required(),
});
