import Joi from 'joi';

export const addTeacherToInternalGroupSchema: Joi.ObjectSchema = Joi.object({
  teacherId: Joi.string().guid().required(),
});
