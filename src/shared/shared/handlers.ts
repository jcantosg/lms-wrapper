import { GetCountriesHandler } from '#shared/application/get-countries/get-countries.handler';
import { CountryRepository } from '#shared/domain/repository/country.repository';

const getCountriesHandler = {
  provide: GetCountriesHandler,
  useFactory: (countryRepository: CountryRepository) =>
    new GetCountriesHandler(countryRepository),
  inject: [CountryRepository],
};

export const handlers = [getCountriesHandler];
