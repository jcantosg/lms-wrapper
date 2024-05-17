import Joi from 'joi';
import { getAllEnrollmentTypes } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { getAllEnrollmentVisibilities } from '#student/domain/enum/enrollment/enrollment-visibility.enum';

export const editEnrollmentSchema = Joi.object({
  type: Joi.string()
    .valid(...getAllEnrollmentTypes())
    .required(),
  visibility: Joi.string()
    .valid(...getAllEnrollmentVisibilities())
    .required(),
  maxCalls: Joi.number().required(),
});
