import * as Joi from 'joi';

export const editCommunicationSchema = Joi.object({
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
  subject: Joi.string().allow('', null).required(),
  shortDescription: Joi.string().allow('', null).optional(),
  body: Joi.string().allow('', null).required(),
  sendByEmail: Joi.boolean().default(false).required(),
  publishOnBoard: Joi.boolean().default(false).required(),
});
