import Joi from 'joi';

export const removeAcademicProgramFromAcademicPeriodSchema: Joi.ObjectSchema =
  Joi.object({
    academicProgramId: Joi.string().guid().required(),
  });
