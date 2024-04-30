import Joi from 'joi';
import { getAllAcademicRecordModalities } from '#academic-offering/domain/enum/academic-record-modality.enum';

export const createAcademicRecordSchema = Joi.object({
  id: Joi.string().guid().required(),
  businessUnitId: Joi.string().guid().required(),
  virtualCampusId: Joi.string().guid().required(),
  studentId: Joi.string().guid().required(),
  academicPeriodId: Joi.string().guid().required(),
  academicProgramId: Joi.string().guid().required(),
  academicRecordModality: Joi.valid(
    ...getAllAcademicRecordModalities(),
  ).required(),
  isModular: Joi.boolean().required(),
});
