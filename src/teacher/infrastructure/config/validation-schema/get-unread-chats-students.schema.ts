import * as Joi from 'joi';

export const getUnreadChatsStudentsSchema: Joi.ObjectSchema = Joi.object({
  fbChatroomIds: Joi.array().items(Joi.string().guid()).required(),
});
