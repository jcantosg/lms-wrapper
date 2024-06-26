import Joi from 'joi';

export const addTeacherToInternalGroupSchema: Joi.ObjectSchema = Joi.object({
  teacherIds: Joi.array().items(Joi.string().guid().required()).required(),
});
