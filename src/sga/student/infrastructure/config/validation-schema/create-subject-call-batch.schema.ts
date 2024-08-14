import Joi from 'joi';

export const createSubjectCallsBatchSchema = Joi.object({
  businessUnitId: Joi.string().guid({ version: 'uuidv4' }).required(),
  academicPeriodId: Joi.string().guid({ version: 'uuidv4' }).required(),
  academicProgramIds: Joi.array()
    .items(Joi.string().guid({ version: 'uuidv4' }))
    .min(1)
    .required(),
});
