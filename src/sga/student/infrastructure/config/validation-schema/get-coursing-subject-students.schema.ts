import Joi from 'joi';

export const getCoursingSubjectStudentsSchema = Joi.object({
  subjectId: Joi.string().uuid().required(),
});
