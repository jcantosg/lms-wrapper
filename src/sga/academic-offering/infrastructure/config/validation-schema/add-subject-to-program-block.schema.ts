import Joi from 'joi';

export const addSubjectToProgramBlockSchema = Joi.object({
  subjectId: Joi.string().guid().required(),
});
