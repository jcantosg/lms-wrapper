import Joi from 'joi';

export const addEdaeUsersToSubjectSchema: Joi.ObjectSchema = Joi.object({
  edaeUsers: Joi.array().items(Joi.string().guid()).min(1).required(),
});
