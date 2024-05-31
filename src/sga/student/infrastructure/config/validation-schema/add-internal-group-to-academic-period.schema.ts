import Joi from 'joi';

export const addInternalGroupToAcademicPeriodSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
  academicPeriodId: Joi.string().guid({ version: 'uuidv4' }).required(),
  prefix: Joi.string().max(10).optional(),
  sufix: Joi.string().max(10).optional(),
  academicProgramId: Joi.string().guid({ version: 'uuidv4' }).required(),
  subjectId: Joi.string().guid({ version: 'uuidv4' }).required(),
  edaeUserIds: Joi.array()
    .items(Joi.string().guid({ version: 'uuidv4' }))
    .min(0)
    .required(),
  isDefaultGroup: Joi.boolean().required(),
});
