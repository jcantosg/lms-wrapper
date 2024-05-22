import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUserPostgresRepository } from '#admin-user/infrastructure/repository/admin-user.postgres-repository';

export const repositories = [
  {
    provide: AdminUserRepository,
    useClass: AdminUserPostgresRepository,
  },
];
