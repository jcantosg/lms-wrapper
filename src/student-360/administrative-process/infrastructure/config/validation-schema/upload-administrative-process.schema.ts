import { getAllAdministrativeProcessTypes } from '#student/domain/enum/administrative-process-type.enum';
import Joi from 'joi';

export const uploadAdministrativeProcessSchema = Joi.object({
  academicRecordId: Joi.string().guid().optional().allow(null, ''),
  type: Joi.valid(...getAllAdministrativeProcessTypes()).required(),
});
