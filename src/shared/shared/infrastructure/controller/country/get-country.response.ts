import { Country } from '#shared/domain/entity/country.entity';

export interface CountryResponse {
  id: string;
  name: string;
  emoji: string;
}

export class GetCountryResponse {
  static create(country: Country): CountryResponse {
    return {
      id: country.id,
      name: country.name,
      emoji: country.emoji,
    };
  }
}
