import { CountryRepository } from '#shared/domain/repository/country.repository';
import { CountryGetter } from '#shared/domain/service/country-getter.service';

const countryGetter = {
  provide: CountryGetter,
  useFactory: (countryRepository: CountryRepository) => {
    return new CountryGetter(countryRepository);
  },
  inject: [CountryRepository],
};
export const services = [countryGetter];
