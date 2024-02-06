import Joi from 'joi';

export const editExaminationCenterSchema: Joi.ObjectSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  address: Joi.string().optional(),
  isActive: Joi.boolean().required(),
});
