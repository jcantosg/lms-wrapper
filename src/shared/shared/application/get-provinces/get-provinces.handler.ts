import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CountryGetter } from '#shared/domain/service/country-getter.service';
import { ProvinceGetter } from '#shared/domain/service/province-getter.service';
import { GetProvincesQuery } from '#shared/application/get-provinces/get-provinces.query';
import { Province } from '#shared/domain/value-object/province.value-object';

export class GetProvincesHandler implements QueryHandler {
  constructor(
    private readonly countryGetter: CountryGetter,
    private readonly provinceGetter: ProvinceGetter,
  ) {}

  async handle(query: GetProvincesQuery): Promise<Province[]> {
    const country = await this.countryGetter.get(query.countryId);

    return await this.provinceGetter.getProvinces(country);
  }
}
