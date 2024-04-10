import { examinationCallSchema } from '#academic-offering/infrastructure/config/schema/examination-call.schema';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { subjectResourceSchema } from '#academic-offering/infrastructure/config/schema/subject-resource.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { programBlockSchema } from '#academic-offering/infrastructure/config/schema/program-block.schema';

export const academicPeriodSchemas = [
  examinationCallSchema,
  academicPeriodSchema,
  subjectSchema,
  evaluationTypeSchema,
  subjectResourceSchema,
  titleSchema,
  academicProgramSchema,
  programBlockSchema,
];
