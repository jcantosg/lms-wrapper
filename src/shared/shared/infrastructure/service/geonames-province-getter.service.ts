import { GeonamesWrapper } from '#shared/infrastructure/clients/geonames/geonames.wrapper';
import { ProvinceGetter } from '#shared/domain/service/province-getter.service';
import { Province } from '#shared/domain/value-object/province.value-object';
import { Country } from '#shared/domain/entity/country.entity';

export class GeonamesProvinceGetter extends ProvinceGetter {
  constructor(private readonly wrapper: GeonamesWrapper) {
    super();
  }

  async getProvinces(country: Country): Promise<Province[]> {
    return await this.wrapper.getProvinces(country);
  }
}
