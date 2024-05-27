import Joi from 'joi';

export const removeEdaeUserFromAdministrativeGroupSchema: Joi.ObjectSchema =
  Joi.object({
    edaeUserId: Joi.string().guid().required(),
  });
