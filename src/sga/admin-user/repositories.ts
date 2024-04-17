import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { RecoveryPasswordTokenRepository } from '#admin-user/domain/repository/recovery-password-token.repository';
import { RefreshTokenRepository } from '#admin-user/domain/repository/refresh-token.repository';
import { AdminUserPostgresRepository } from '#admin-user/infrastructure/repository/admin-user.postgres-repository';
import { RecoveryPasswordTokenPostgresRepository } from '#admin-user/infrastructure/repository/recovery-password-token.postgres-repository';
import { RefreshTokenPostgresRepository } from '#admin-user/infrastructure/repository/refresh-token.postgres-repository';

export const repositories = [
  {
    provide: AdminUserRepository,
    useClass: AdminUserPostgresRepository,
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
