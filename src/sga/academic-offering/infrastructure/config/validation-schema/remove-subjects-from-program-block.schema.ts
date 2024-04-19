import Joi from 'joi';

export const removeSubjectsFromProgramBlockSchema = Joi.object({
  subjectIds: Joi.array().items(Joi.string().guid()).required(),
});
