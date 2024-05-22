import Joi from 'joi';

export const createAcademicPeriodSchema: Joi.ObjectSchema = Joi.object({
  id: Joi.string().guid().required(),
  name: Joi.string().required(),
  code: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required().greater(Joi.ref('startDate')),
  businessUnit: Joi.string().guid().required(),
  periodBlocks: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().guid().required(),
        name: Joi.string().required(),
        startDate: Joi.date().required(),
      }),
    )
    .required(),
});
