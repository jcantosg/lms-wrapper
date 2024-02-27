import { EdaeUserRepository } from './domain/repository/edae-user.repository';
import { EdaeUserPostgresRepository } from './infrastructure/repository/edae-user.postgres-repository';

export const repositories = [
  {
    provide: EdaeUserRepository,
    useClass: EdaeUserPostgresRepository,
  },
];
