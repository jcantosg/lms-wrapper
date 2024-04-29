import * as Joi from 'joi';

export const getVirtualCampusByBusinessUnitSchema = Joi.object({
  businessUnit: Joi.string().uuid().required(),
});
