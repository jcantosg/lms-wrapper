import Joi from 'joi';

export const createTitleSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  officialCode: Joi.string().optional(),
  officialTitle: Joi.string().required(),
  officialProgram: Joi.string().required(),
  businessUnit: Joi.string().guid().required(),
});
