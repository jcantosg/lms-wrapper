import Joi from 'joi';
import { getAllAcademicRecordModalities } from '#student/domain/enum/academic-record-modality.enum';
import { getAllAcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';

export const editAcademicRecordSchema = Joi.object({
  status: Joi.valid(...getAllAcademicRecordStatusEnum()).required(),
  modality: Joi.valid(...getAllAcademicRecordModalities()).required(),
  isModular: Joi.boolean().required(),
});
