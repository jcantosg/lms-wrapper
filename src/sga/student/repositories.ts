import { StudentRepository } from '#student/domain/repository/student.repository';
import { StudentPostgresRepository } from '#student/infrastructure/repository/student.postgres-repository';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordPostgresRepository } from '#student/infrastructure/repository/academic-record.postgres-repository';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { InternalGroupPostgresRepository } from '#student/infrastructure/repository/internal-group.postgres-repository';

export const repositories = [
  {
    provide: StudentRepository,
    useClass: StudentPostgresRepository,
  },
  {
    provide: AcademicRecordRepository,
    useClass: AcademicRecordPostgresRepository,
  },
  {
    provide: InternalGroupRepository,
    useClass: InternalGroupPostgresRepository,
  },
];
