import { CountryRepository } from '#shared/domain/repository/country.repository';

export class CountryMockRepository implements CountryRepository {
  save = jest.fn();
  getAll = jest.fn();
  get = jest.fn();
  getByName = jest.fn();
}
