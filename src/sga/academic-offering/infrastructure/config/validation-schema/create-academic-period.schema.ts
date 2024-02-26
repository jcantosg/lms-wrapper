import Joi from 'joi';
import { TimeZoneEnum } from '#shared/domain/enum/time-zone.enum';

export const createAcademicPeriodSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  code: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required().greater(Joi.ref('startDate')),
  businessUnit: Joi.string().guid().required(),
  examinationCalls: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().guid().required(),
        name: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required().greater(Joi.ref('startDate')),
        timezone: Joi.string()
          .required()
          .valid(...Object.values(TimeZoneEnum))
          .required(),
      }),
    )
    .required(),
  blocksNumber: Joi.number().required().greater(0),
});
