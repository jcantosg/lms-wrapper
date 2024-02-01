import Joi from 'joi';

export const RemoveBusinessUnitFromExaminationCenterSchema: Joi.ObjectSchema =
  Joi.object({
    businessUnit: Joi.string().guid().required(),
  });
