import { Country } from '#shared/domain/entity/country.entity';

export abstract class CountryRepository {
  abstract save(country: Country): Promise<void>;
  abstract getAll(filter: string | undefined): Promise<Country[]>;
  abstract get(id: string): Promise<Country | null>;
}
