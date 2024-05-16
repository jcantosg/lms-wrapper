import { createCollectionSchema } from '#/sga/shared/infrastructure/config/validation-schema/collection-schema';

const orderByFields = [
  'subjectName',
  'visibility',
  'programBlock',
  'type',
  'callDate',
  'hours',
  'finalGrade',
  'status',
];
export const getEnrollmentsByAcademicRecordSchema =
  createCollectionSchema(orderByFields);
