import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { Province } from '#shared/domain/value-object/province.value-object';
import { CityGetter } from '#shared/domain/service/city-getter.service';
import { GetCitiesQuery } from '#shared/application/get-cities/get-cities.query';

export class GetCitiesHandler implements QueryHandler {
  constructor(
    private readonly countryGetter: CountryGetter,
    private readonly cityGetter: CityGetter,
  ) {}

  async handle(query: GetCitiesQuery): Promise<Province[]> {
    const country = await this.countryGetter.get(query.countryId);
    const province = new Province(query.provinceName);

    return await this.cityGetter.getCities(country, province);
  }
}
