import { examinationCallSchema } from '#academic-offering/infrastructure/config/schema/examination-call.schema';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';

export const academicPeriodSchemas = [
  examinationCallSchema,
  academicPeriodSchema,
  subjectSchema,
  evaluationTypeSchema,
  titleSchema,
];
