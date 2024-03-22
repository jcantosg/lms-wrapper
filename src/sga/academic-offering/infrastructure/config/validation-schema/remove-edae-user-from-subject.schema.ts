import Joi from 'joi';

export const removeEdaeUserFromSubjectSchema: Joi.ObjectSchema = Joi.object({
  edaeUser: Joi.string().guid().required(),
});
