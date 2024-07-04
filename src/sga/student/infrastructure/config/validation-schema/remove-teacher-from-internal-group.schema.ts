import Joi from 'joi';

export const removeTeacherFromInternalGroupSchema: Joi.ObjectSchema =
  Joi.object({
    teacherId: Joi.string().guid().required(),
  });
