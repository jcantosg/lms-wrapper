import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = ['name', 'code', 'officialCode'];

export const listAcademicProgramByPeriodSchema =
  createCollectionSchema(orderByFields);
