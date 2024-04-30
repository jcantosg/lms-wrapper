import { StudentRepository } from '#student/domain/repository/student.repository';
import { StudentPostgresRepository } from '#student/infrastructure/repository/student.postgres-repository';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { AcademicRecordPostgresRepository } from '#student/infrastructure/repository/academic-record.postgres-repository';

export const repositories = [
  {
    provide: StudentRepository,
    useClass: StudentPostgresRepository,
  },
  {
    provide: AcademicRecordRepository,
    useClass: AcademicRecordPostgresRepository,
  },
];
