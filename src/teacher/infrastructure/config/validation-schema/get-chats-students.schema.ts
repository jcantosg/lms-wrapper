import * as Joi from 'joi';

export const getChatsStudentsSchema: Joi.ObjectSchema = Joi.object({
  subjectId: Joi.string().guid().optional(),
  titleId: Joi.string().guid().optional().when('subjectId', {
    is: Joi.exist(),
    then: Joi.required(),
  }),
  academicPeriodId: Joi.string()
    .guid()
    .optional()
    .when('titleId', {
      is: Joi.exist(),
      then: Joi.required(),
    })
    .when('subjectId', {
      is: Joi.exist(),
      then: Joi.required(),
    }),
  businessUnitId: Joi.string()
    .guid()
    .optional()
    .when('academicPeriodId', {
      is: Joi.exist(),
      then: Joi.required(),
    })
    .when('titleId', {
      is: Joi.exist(),
      then: Joi.required(),
    })
    .when('subjectId', {
      is: Joi.exist(),
      then: Joi.required(),
    }),
});
