import * as Joi from 'joi';

export const getChatsStudentsSchema: Joi.ObjectSchema = Joi.object({
  subjectId: Joi.string().guid().required(),
  titleId: Joi.string().guid().required(),
  academicPeriodId: Joi.string().guid().required(),
  businessUnitId: Joi.string().guid().required(),
});
