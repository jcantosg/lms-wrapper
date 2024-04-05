import Joi from 'joi';

export const addAcademicProgramsToAcademicPeriodSchema: Joi.ObjectSchema =
  Joi.object({
    academicProgramId: Joi.string().guid().required(),
  });
