import Joi from 'joi';

export const editClassroomSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  capacity: Joi.number().required(),
});
