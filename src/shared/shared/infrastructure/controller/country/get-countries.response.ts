import { Country } from '#shared/domain/entity/country.entity';

export interface CountryResponse {
  id: string;
  name: string;
  emoji: string;
}

export class GetCountriesResponse {
  static create(countries: Country[]): CountryResponse[] {
    return countries.map((country) => {
      return {
        id: country.id,
        name: country.name,
        emoji: country.emoji,
      };
    });
  }
}
