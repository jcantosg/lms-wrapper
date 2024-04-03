import Joi from 'joi';

export const uploadSubjectResourceSchema = Joi.object({
  ids: Joi.array().items(Joi.string().guid().required()),
});
