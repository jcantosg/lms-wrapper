import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';
import Joi from 'joi';

const orderByFields = [
  'name',
  'surname',
  'email',
  'identityDocumentNumber',
  'businessUnit',
  'academicProgram',
];

export const searchStudentsSchema = createCollectionSchema(orderByFields, {
  text: Joi.string().required(),
});
