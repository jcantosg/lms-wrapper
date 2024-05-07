import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { subjectResourceSchema } from '#academic-offering/infrastructure/config/schema/subject-resource.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';
import { periodBlockSchema } from '#academic-offering/infrastructure/config/schema/period-block.schema';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';
import { blockRelationSchema } from '#academic-offering/infrastructure/config/schema/block-relation.schema';

export const academicPeriodSchemas = [
  academicPeriodSchema,
  subjectSchema,
  evaluationTypeSchema,
  subjectResourceSchema,
  titleSchema,
  academicProgramSchema,
  programBlockSchema,
  periodBlockSchema,
  academicRecordSchema,
  blockRelationSchema,
];
