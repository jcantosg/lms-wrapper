import Joi from 'joi';
import { getAllAcademicRecordModalities } from '#student/domain/enum/academic-record-modality.enum';

export const transferAcademicRecordSchema = Joi.object({
  academicRecordId: Joi.string().guid().required(),
  businessUnitId: Joi.string().guid().required(),
  virtualCampusId: Joi.string().guid().required(),
  academicPeriodId: Joi.string().guid().required(),
  academicProgramId: Joi.string().guid().required(),
  modality: Joi.valid(...getAllAcademicRecordModalities()).required(),
  isModular: Joi.boolean().required(),
  comments: Joi.string().optional().allow(''),
  files: Joi.array().optional(),
});
