import Joi from 'joi';

export const addSubjectCallSchema = Joi.object({
  subjectCallId: Joi.string().guid({ version: 'uuidv4' }).required(),
});
