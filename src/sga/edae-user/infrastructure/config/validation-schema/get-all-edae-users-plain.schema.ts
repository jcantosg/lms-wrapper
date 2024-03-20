import Joi from 'joi';

export const getAllEdaeUsersPlainSchema = Joi.string()
  .guid()
  .required()
  .messages({
    'string.base': `"businessUnit" should be a type of string`,
    'string.guid': `"businessUnit" should be a valid GUID`,
    'string.empty': `"businessUnit" cannot be an empty field`,
    'any.required': `"businessUnit" is a required field`,
  });
