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
export const getStudentsSchema = createCollectionSchema(orderByFields, {
  name: Joi.string().optional(),
  surname: Joi.string().optional(),
  universaeEmail: Joi.string().optional(),
  identityDocumentNumber: Joi.string().optional(),
  businessUnit: Joi.string().optional(),
  academicProgram: Joi.string().optional(),
  isDefense: Joi.boolean().optional()
});
