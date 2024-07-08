import Joi from 'joi';

export const addStudentToInternalGroupSchema: Joi.ObjectSchema = Joi.object({
  studentIds: Joi.array().items(Joi.string().guid().required()).required(),
});
