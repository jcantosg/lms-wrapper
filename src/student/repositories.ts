import { StudentRefreshTokenRepository } from '#/student/student/domain/repository/student-refresh-token.repository';
import { StudentRefreshTokenPostgresRepository } from '#/student/student/infrastructure/repository/student-refresh-token.postgres-repository';
import { StudentRecoveryPasswordTokenRepository } from '#/student/student/domain/repository/student-recovery-password-token.repository';
import { StudentRecoveryPasswordTokenPostgresRepository } from '#/student/student/infrastructure/repository/student-recovery-password-token.postgres-repository';

export const repositories = [
  {
    provide: StudentRefreshTokenRepository,
    useClass: StudentRefreshTokenPostgresRepository,
  },
  {
    provide: StudentRecoveryPasswordTokenRepository,
    useClass: StudentRecoveryPasswordTokenPostgresRepository,
  },
];
