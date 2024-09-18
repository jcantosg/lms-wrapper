import * as Joi from 'joi';

export const getSubjectsTeacherChatSchema: Joi.ObjectSchema = Joi.object({
  titleId: Joi.string().guid().required(),
  academicPeriodId: Joi.string().guid().required(),
});
