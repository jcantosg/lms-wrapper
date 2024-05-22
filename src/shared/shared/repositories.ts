import { CountryRepository } from '#shared/domain/repository/country.repository';
import { CountryPostgresRepository } from '#shared/infrastructure/repository/country.postgres-repository';
import { RefreshTokenRepository } from '#admin-user/domain/repository/refresh-token.repository';
import { RefreshTokenPostgresRepository } from '#admin-user/infrastructure/repository/refresh-token.postgres-repository';
import { RecoveryPasswordTokenRepository } from '#admin-user/domain/repository/recovery-password-token.repository';
import { RecoveryPasswordTokenPostgresRepository } from '#admin-user/infrastructure/repository/recovery-password-token.postgres-repository';
import { StudentRepository } from '#/student/student/domain/repository/student.repository';
import { StudentPostgresRepository } from '#/student/student/infrastructure/repository/student.postgres-repository';

export const repositories = [
  {
    provide: CountryRepository,
    useClass: CountryPostgresRepository,
  },
  {
    provide: StudentRepository,
    useClass: StudentPostgresRepository,
  },
  {
    provide: RefreshTokenRepository,
    useClass: RefreshTokenPostgresRepository,
  },
  {
    provide: RecoveryPasswordTokenRepository,
    useClass: RecoveryPasswordTokenPostgresRepository,
  },
];
