import * as Joi from 'joi';

export const createCommunicationSchema = Joi.object({
  id: Joi.string().uuid().required(),
  businessUnitIds: Joi.array()
    .items(Joi.string().uuid())
    .default([])
    .required(),
  academicPeriodIds: Joi.array()
    .items(Joi.string().uuid())
    .default([])
    .required(),
  titleIds: Joi.array().items(Joi.string().uuid()).default([]).required(),
  academicProgramIds: Joi.array()
    .items(Joi.string().uuid())
    .default([])
    .required(),
  internalGroupIds: Joi.array()
    .items(Joi.string().uuid())
    .default([])
    .required(),
  studentIds: Joi.array().items(Joi.string().uuid()).default([]).required(),
});
