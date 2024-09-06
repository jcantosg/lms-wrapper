import * as Joi from 'joi';

export const getStudentCommunicationsSchema: Joi.ObjectSchema = Joi.object({
  subject: Joi.string().optional(),
});
