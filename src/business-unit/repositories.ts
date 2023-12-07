import { CountryRepository } from './domain/repository/country.repository';
import { CountryPostgresRepository } from './infrastructure/repository/country.postgres-repository';

export const repositories = [
  {
    provide: CountryRepository,
    useClass: CountryPostgresRepository,
  },
];
