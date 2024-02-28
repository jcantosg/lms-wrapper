import Joi from 'joi';

export const AddBusinessUnitsSchema: Joi.ObjectSchema = Joi.object({
  businessUnits: Joi.array().items(Joi.string().guid()).min(1).required(),
});
