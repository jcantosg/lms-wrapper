import { Injectable } from '@nestjs/common';
import { Country } from '#shared/domain/entity/country.entity';
import { CountryRepository } from '#shared/domain/repository/country.repository';
import { GetCountriesQuery } from './get-countries.query';
import { QueryHandler } from '#shared/domain/bus/query.handler';

@Injectable()
export class GetCountriesHandler implements QueryHandler {
  constructor(private readonly countryRepository: CountryRepository) {}

  async handle(query: GetCountriesQuery): Promise<Country[]> {
    return await this.countryRepository.getAll(query.filter);
  }
}
