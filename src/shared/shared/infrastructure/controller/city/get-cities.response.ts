import { City } from '#shared/domain/value-object/city';

export class GetCitiesResponse {
  static create(cities: City[]) {
    return cities.map((city: City) => city.value);
  }
}
