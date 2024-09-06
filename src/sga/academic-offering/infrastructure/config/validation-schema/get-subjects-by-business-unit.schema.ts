import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';
import Joi from 'joi';

export const getSubjectsByBusinessUnitSchema = Joi.object({
  businessUnit: Joi.string().guid().required(),
  academicProgramId: Joi.string().guid().required(),
  subjectType: Joi.string()
    .valid(...Object.values(SubjectType))
    .optional(),
});
