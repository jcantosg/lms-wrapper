import Joi from 'joi';

export const setDefaultTeacherToSubjectSchema = Joi.object({
  teacherId: Joi.string().guid().required(),
});
