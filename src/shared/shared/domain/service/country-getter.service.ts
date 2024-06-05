import { Country } from '#shared/domain/entity/country.entity';
import { CountryNotFoundException } from '#shared/domain/exception/country/country-not-found.exception';
import { CountryRepository } from '#shared/domain/repository/country.repository';

export class CountryGetter {
  constructor(private readonly countryRepository: CountryRepository) {}

  async get(id: string): Promise<Country> {
    const country = await this.countryRepository.get(id);

    if (!country) {
      throw new CountryNotFoundException();
    }

    return country;
  }

  async getByName(name: string | null): Promise<Country> {
    if (!name) {
      throw new CountryNotFoundException();
    }
    const normalizedName = name.toLowerCase().trim();
    const country = await this.countryRepository.getByName(normalizedName);

    if (!country) {
      throw new CountryNotFoundException();
    }

    return country;
  }
}
