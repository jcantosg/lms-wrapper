import Joi from 'joi';

export const createInternalGroupsBatchSchema = Joi.object({
  academicPeriodId: Joi.string().guid({ version: 'uuidv4' }).required(),
  prefix: Joi.string().max(10).optional(),
  sufix: Joi.string().max(10).optional(),
  academicPrograms: Joi.array()
    .items(Joi.string().guid({ version: 'uuidv4' }))
    .min(1)
    .required(),
  isDefault: Joi.boolean().required(),
});
