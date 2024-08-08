import * as Joi from 'joi';

export const getAllTitlesPlainSchema = Joi.object({
  businessUnitIds: Joi.array().items(Joi.string()).required(),
});
