import Joi from 'joi';

export const getResignationApplicationSchema = Joi.object({
  academicRecord: Joi.string().guid().required(),
});
