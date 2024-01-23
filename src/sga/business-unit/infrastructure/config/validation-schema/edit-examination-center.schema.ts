import Joi from 'joi';

export const editExaminationCenterSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  address: Joi.string().optional(),
  businessUnits: Joi.array().items(Joi.string().guid()).required(),
  isActive: Joi.boolean().required(),
  classrooms: Joi.array().items(Joi.string().guid()).required(),
});
