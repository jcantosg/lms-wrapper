import { Controller, Get } from '@nestjs/common';
import { GetCountriesHandler } from '#shared/application/get-countries/get-countries.handler';
import { GetCountriesResponse } from '#shared/infrastructure/controller/country/get-countries.response';
import { CountryResponse } from '#shared/infrastructure/controller/country/get-country.response';

@Controller('country')
export class GetCountryController {
  constructor(private readonly handler: GetCountriesHandler) {}

  @Get()
  async getAll(): Promise<CountryResponse[]> {
    const countries = await this.handler.handle();

    return GetCountriesResponse.create(countries);
  }
}
