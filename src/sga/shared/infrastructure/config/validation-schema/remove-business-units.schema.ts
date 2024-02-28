import Joi from 'joi';

export const RemoveBusinessUnitsSchema: Joi.ObjectSchema = Joi.object({
  businessUnit: Joi.string().guid().required(),
});
