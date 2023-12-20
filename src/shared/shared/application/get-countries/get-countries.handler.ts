import { QueryEmptyHandler } from '#shared/domain/bus/query.empty.handler';
import { CountryRepository } from '#shared/domain/repository/country.repository';

export class GetCountriesHandler implements QueryEmptyHandler {
  constructor(private readonly countryRepository: CountryRepository) {}

  async handle() {
    return await this.countryRepository.getAll();
  }
}
