import Joi from 'joi';

export const addExaminationCentersToBusinessUnitSchema: Joi.ObjectSchema =
  Joi.object({
    examinationCenters: Joi.array()
      .items(Joi.string().guid())
      .min(1)
      .required(),
  });
