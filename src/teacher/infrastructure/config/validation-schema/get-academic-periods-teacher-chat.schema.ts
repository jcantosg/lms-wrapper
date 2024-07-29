import * as Joi from 'joi';

export const getAcademicPeriodsTeacherChatSchema: Joi.ObjectSchema = Joi.object(
  {
    businessUnitId: Joi.string().guid().required(),
  },
);
