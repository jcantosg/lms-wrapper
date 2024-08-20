import { CityGetter } from '#shared/domain/service/city-getter.service';
import { Province } from '#shared/domain/value-object/province.value-object';
import { GeonamesWrapper } from '#shared/infrastructure/clients/geonames/geonames.wrapper';
import { Country } from '#shared/domain/entity/country.entity';
import { City } from '#shared/domain/value-object/city';

export class GeonamesCityGetter extends CityGetter {
  constructor(private readonly wrapper: GeonamesWrapper) {
    super();
  }

  async getCities(country: Country, province: Province): Promise<City[]> {
    return await this.wrapper.getCities(country, province.value);
  }
}
