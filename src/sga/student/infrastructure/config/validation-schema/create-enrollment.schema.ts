import Joi from 'joi';

export const createEnrollmentSchema = Joi.object({
  ids: Joi.array().items(
    Joi.object({
      enrollmentId: Joi.string().guid().required(),
      subjectId: Joi.string().guid().required(),
    }),
  ),
  academicRecordId: Joi.string().guid().required(),
});
