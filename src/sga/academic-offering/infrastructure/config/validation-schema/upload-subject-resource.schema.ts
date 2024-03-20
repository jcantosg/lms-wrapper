import Joi from 'joi';

export const uploadSubjectResourceSchema = Joi.object({
  id: Joi.string().guid().required(),
});
