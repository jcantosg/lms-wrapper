import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';
import { administrativeGroupSchema } from '#student/infrastructure/config/schema/administrative-group.schema';
import { enrollmentSchema } from '#student/infrastructure/config/schema/enrollment.schema';
import { subjectCallSchema } from '#student/infrastructure/config/schema/subject-call.schema';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';
import { academicRecordTransferSchema } from '#student/infrastructure/config/schema/academic-record-transfer.schema';
import { administrativeProcessSchema } from '#student/infrastructure/config/schema/administrative-process.schema';
import { subjectCallScheduleHistorySchema } from '#student/infrastructure/config/schema/subject-call-schedule-history.schema';

export const studentSchemas = [
  academicRecordSchema,
  internalGroupSchema,
  enrollmentSchema,
  administrativeGroupSchema,
  subjectCallSchema,
  academicRecordTransferSchema,
  administrativeProcessSchema,
  subjectCallScheduleHistorySchema,
];
