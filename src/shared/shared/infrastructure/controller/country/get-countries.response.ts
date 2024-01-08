import { Country } from '#shared/domain/entity/country.entity';
import {
  CountryResponse,
  GetCountryResponse,
} from '#shared/infrastructure/controller/country/get-country.response';

export class GetCountriesResponse {
  static create(countries: Country[]): CountryResponse[] {
    return countries.map((country) => {
      return GetCountryResponse.create(country);
    });
  }
}
