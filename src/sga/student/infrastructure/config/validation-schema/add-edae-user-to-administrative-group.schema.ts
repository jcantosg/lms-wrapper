import Joi from 'joi';

export const addEdaeUsersToAdministrativeGroupSchema: Joi.ObjectSchema =
  Joi.object({
    edaeUserIds: Joi.array().items(Joi.string().guid()).min(1).required(),
  });
