import Joi from 'joi';

export const removeExaminationCentersFromBusinessUnitSchema: Joi.ObjectSchema =
  Joi.object({
    examinationCenter: Joi.string().guid().required(),
  });
