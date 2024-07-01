import { EdaeUserRefreshTokenRepository } from '#/teacher/domain/repository/edae-user-refresh-token.repository';
import { EdaeUserRefreshTokenPostgresRepository } from '#/teacher/infrastructure/repository/edae-user-refresh-token.postgres-repository';

export const repositories = [
  {
    provide: EdaeUserRefreshTokenRepository,
    useClass: EdaeUserRefreshTokenPostgresRepository,
  },
];
