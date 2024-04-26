import { GetCountriesHandler } from '#shared/application/get-countries/get-countries.handler';
import { CountryRepository } from '#shared/domain/repository/country.repository';
import { GetProvincesHandler } from '#shared/application/get-provinces/get-provinces.handler';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { ProvinceGetter } from '#shared/domain/service/province-getter.service';

const getCountriesHandler = {
  provide: GetCountriesHandler,
  useFactory: (countryRepository: CountryRepository) =>
    new GetCountriesHandler(countryRepository),
  inject: [CountryRepository],
};

const getProvincesHandler = {
  provide: GetProvincesHandler,
  useFactory: (
    countryGetter: CountryGetter,
    provinceGetter: ProvinceGetter,
  ): GetProvincesHandler =>
    new GetProvincesHandler(countryGetter, provinceGetter),
  inject: [CountryGetter, ProvinceGetter],
};

export const handlers = [getCountriesHandler, getProvincesHandler];
