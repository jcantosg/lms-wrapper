import { studentSchema } from '#student/infrastructure/config/schema/student.schema';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';
import { administrativeGroupSchema } from '#student/infrastructure/config/schema/administrative-group.schema';
import { enrollmentSchema } from '#student/infrastructure/config/schema/enrollment.schema';
import { subjectCallSchema } from '#student/infrastructure/config/schema/subject-call.schema';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';

export const studentSchemas = [
  studentSchema,
  academicRecordSchema,
  enrollmentSchema,
  administrativeGroupSchema,
  internalGroupSchema,
  subjectCallSchema,
];
