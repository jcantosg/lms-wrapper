import * as Joi from 'joi';

export const deleteCommunicationsSchema = Joi.object({
  ids: Joi.array().items(Joi.string().uuid()).required(),
});
