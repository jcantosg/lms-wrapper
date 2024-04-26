import { Country } from '#shared/domain/entity/country.entity';
import { Province } from '#shared/domain/value-object/province.value-object';

export abstract class ProvinceGetter {
  abstract getProvinces(country: Country): Promise<Province[]>;
}
