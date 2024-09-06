import { getAllAdministrativeProcessStatus } from '#student/domain/enum/administrative-process-status.enum';
import Joi from 'joi';

export const editAdministrativeProcessSchema = Joi.object({
  status: Joi.valid(...getAllAdministrativeProcessStatus()).required(),
});
