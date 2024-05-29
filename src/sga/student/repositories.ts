import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordPostgresRepository } from '#student/infrastructure/repository/academic-record.postgres-repository';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { AdministrativeGroupPostgresRepository } from '#student/infrastructure/repository/administrative-group.postgres-repository';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupPostgresRepository } from '#student/infrastructure/repository/internal-group.postgres-repository';
import { EnrollmentRepository } from '#student/domain/repository/enrollment.repository';
import { EnrollmentPostgresRepository } from '#student/infrastructure/repository/enrollment.postgres-repository';
import { SubjectCallRepository } from '#student/domain/repository/subject-call.repository';
import { SubjectCallPostgresRepository } from '#student/infrastructure/repository/subject-call.postgres-repository';

export const repositories = [
  {
    provide: AcademicRecordRepository,
    useClass: AcademicRecordPostgresRepository,
  },
  {
    provide: AdministrativeGroupRepository,
    useClass: AdministrativeGroupPostgresRepository,
  },
  {
    provide: InternalGroupRepository,
    useClass: InternalGroupPostgresRepository,
  },
  {
    provide: EnrollmentRepository,
    useClass: EnrollmentPostgresRepository,
  },
  {
    provide: SubjectCallRepository,
    useClass: SubjectCallPostgresRepository,
  },
];
