import { Controller, Get, Query, UseGuards, UsePipes } from '@nestjs/common';
import { GetCountriesHandler } from '#shared/application/get-countries/get-countries.handler';
import { GetCountriesResponse } from '#shared/infrastructure/controller/country/get-countries.response';
import { CountryResponse } from '#shared/infrastructure/controller/country/get-country.response';
import { GetCountriesQuery } from '#shared/application/get-countries/get-countries.query';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getCountriesSchema } from '#shared/infrastructure/config/validation-schema/get-countries.schema';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';

type GetCountriesQueryParams = {
  filter: string;
};

@Controller('student-360')
export class GetCountryStudentController {
  constructor(private readonly handler: GetCountriesHandler) {}

  @Get('country')
  @UseGuards(StudentJwtAuthGuard)
  @UsePipes(new JoiRequestQueryParamValidationPipeService(getCountriesSchema))
  async getAll(
    @Query() queryParams: GetCountriesQueryParams,
  ): Promise<CountryResponse[]> {
    const query = new GetCountriesQuery(queryParams.filter);
    const countries = await this.handler.handle(query);

    return GetCountriesResponse.create(countries);
  }
}
