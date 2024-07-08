import Joi from 'joi';

export const removeStudentFromInternalGroupSchema: Joi.ObjectSchema =
  Joi.object({
    studentId: Joi.string().guid().required(),
  });
