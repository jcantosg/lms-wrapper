import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { ExaminationCallPostgresRepository } from '#academic-offering/infrastructure/repository/examination-call.postgres-repository';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { AcademicPeriodPostgresRepository } from '#academic-offering/infrastructure/repository/academic-period.postgres-repository';

export const repositories = [
  {
    provide: ExaminationCallRepository,
    useClass: ExaminationCallPostgresRepository,
  },
  {
    provide: AcademicPeriodRepository,
    useClass: AcademicPeriodPostgresRepository,
  },
];
