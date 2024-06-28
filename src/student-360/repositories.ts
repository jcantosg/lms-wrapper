import { StudentRefreshTokenRepository } from '#student-360/student/domain/repository/student-refresh-token.repository';
import { StudentRefreshTokenPostgresRepository } from '#student-360/student/infrastructure/repository/student-refresh-token.postgres-repository';
import { StudentRecoveryPasswordTokenRepository } from '#student-360/student/domain/repository/student-recovery-password-token.repository';
import { StudentRecoveryPasswordTokenPostgresRepository } from '#student-360/student/infrastructure/repository/student-recovery-password-token.postgres-repository';

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
