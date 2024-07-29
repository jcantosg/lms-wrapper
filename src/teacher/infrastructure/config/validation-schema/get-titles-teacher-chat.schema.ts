import * as Joi from 'joi';

export const getTitlesTeacherChatSchema: Joi.ObjectSchema = Joi.object({
  academicPeriodId: Joi.string().guid().required(),
});
