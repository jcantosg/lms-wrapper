import Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import { getAllAdministrativeProcessTypes } from '#student/domain/enum/administrative-process-type.enum';
import { getAllAdministrativeProcessStatus } from '#student/domain/enum/administrative-process-status.enum';

const orderByFields = [
  'student',
  'businessUnit',
  'createdAt',
  'updatedAt',
  'type',
  'status',
];

export const getAllAdministrativeProcessesSchema = createCollectionSchema(
  orderByFields,
  {
    name: Joi.string().optional(),
    businessUnit: Joi.string().guid().optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    type: Joi.valid(...getAllAdministrativeProcessTypes()).optional(),
    status: Joi.valid(...getAllAdministrativeProcessStatus()).optional(),
    orderBy: Joi.string()
      .valid(...orderByFields)
      .default('student'),
  },
);
