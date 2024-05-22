import { StudentRefreshTokenRepository } from '#/student/student/domain/repository/student-refresh-token.repository';
import { StudentRefreshTokenPostgresRepository } from '#/student/student/infrastructure/repository/student-refresh-token.postgres-repository';

export const repositories = [
  {
    provide: StudentRefreshTokenRepository,
    useClass: StudentRefreshTokenPostgresRepository,
  },
];
