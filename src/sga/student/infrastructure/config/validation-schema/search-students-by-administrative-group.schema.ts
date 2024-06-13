import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = ['name', 'identityDocumentNumber'];

export const searchStudentsByAdministrativeGroupSchema = createCollectionSchema(
  orderByFields,
  {
    text: Joi.string().trim().required(),
  },
);
