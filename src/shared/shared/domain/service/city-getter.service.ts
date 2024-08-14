import { Country } from '#shared/domain/entity/country.entity';
import { Province } from '#shared/domain/value-object/province.value-object';
import { City } from '#shared/domain/value-object/city';

export abstract class CityGetter {
  abstract getCities(country: Country, province: Province): Promise<City[]>;
}
