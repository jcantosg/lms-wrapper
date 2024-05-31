import Joi from 'joi';

export const moveSubjectSchema = Joi.object({
  subjectIds: Joi.array().items(Joi.string().guid()).required(),
  newBlockId: Joi.string().guid().required(),
});
