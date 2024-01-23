import Joi from 'joi';

export const createClassroomSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  code: Joi.string().required(),
  capacity: Joi.number().required(),
  examinationCenterId: Joi.string().guid().required(),
});
