import { Country } from '../entity/country.entity';

export abstract class CountryRepository {
  abstract save(country: Country): Promise<void>;
  abstract existsById(id: string): Promise<boolean>;
}
