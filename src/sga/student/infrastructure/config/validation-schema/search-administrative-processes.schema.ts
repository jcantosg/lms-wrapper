import Joi from 'joi';
import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = [
  'student',
  'businessUnit',
  'createdAt',
  'updatedAt',
  'type',
  'status',
];

export const searchAdministrativeProcessesSchema = createCollectionSchema(
  orderByFields,
  {
    text: Joi.string().required(),
    orderBy: Joi.string()
      .valid(...orderByFields)
      .default('name'),
  },
);
