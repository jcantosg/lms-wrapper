import Joi from 'joi';

export const editChatroomSchema: Joi.ObjectSchema = Joi.object({
  chatroomId: Joi.string().guid().required(),
});
