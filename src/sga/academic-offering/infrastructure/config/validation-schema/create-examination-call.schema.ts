import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import * as Joi from 'joi';

export const createExaminationCallSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  timezone: Joi.string()
    .required()
    .valid(...Object.values(TimeZoneEnum))
    .required(),
  academicPeriodId: Joi.string().guid().required(),
});
