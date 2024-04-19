import Joi from 'joi';

export const getSubjectsByBusinessUnitSchema = Joi.object({
  businessUnit: Joi.string().guid().required(),
});