import { StudentRepository } from '#/student/domain/repository/student.repository';
import { StudentPostgresRepository } from '#/student/infrastructure/repository/student.postgres-repository';

export const repositories = [
  {
    provide: StudentRepository,
    useClass: StudentPostgresRepository,
  },
];
