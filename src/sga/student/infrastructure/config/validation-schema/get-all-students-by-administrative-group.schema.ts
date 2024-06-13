import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = ['name', 'identityDocumentNumber'];

export const getAllStudentsByAdministrativeGroupSchema =
  createCollectionSchema(orderByFields);
