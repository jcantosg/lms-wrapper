import { CountryRepository } from '#shared/domain/repository/country.repository';
import { CountryPostgresRepository } from '#shared/infrastructure/repository/country.postgres-repository';

export const repositories = [
  {
    provide: CountryRepository,
    useClass: CountryPostgresRepository,
  },
];
