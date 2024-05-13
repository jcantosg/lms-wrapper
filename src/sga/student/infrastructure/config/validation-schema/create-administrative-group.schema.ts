import Joi from 'joi';

export const createAdministrativeGroupSchema = Joi.object({
  academicProgramIds: Joi.array().items(Joi.string().guid()).min(1).required(),
  businessUnitId: Joi.string().guid().required(),
  academicPeriodId: Joi.string().guid().required(),
});
