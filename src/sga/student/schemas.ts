import { studentSchema } from '#student/infrastructure/config/schema/student.schema';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';
import { administrativeGroupSchema } from '#student/infrastructure/config/schema/administrative-group.schema';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';

export const studentSchemas = [
  studentSchema,
  academicRecordSchema,
  administrativeGroupSchema,
  internalGroupSchema,
];
