import Joi from 'joi';

export const editTitleSchema = Joi.object({
  name: Joi.string().required(),
  officialCode: Joi.string().optional(),
  officialTitle: Joi.string().required(),
  officialProgram: Joi.string().required(),
  businessUnit: Joi.string().guid().required(),
});
