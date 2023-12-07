import { CountryRepository } from '../../../src/business-unit/domain/repository/country.repository';

export class CountryMockRepository implements CountryRepository {
  save = jest.fn();
  existsById = jest.fn();
}
