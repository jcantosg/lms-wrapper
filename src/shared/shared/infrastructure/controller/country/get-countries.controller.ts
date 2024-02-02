import { Controller, Get, UseGuards, Query, UsePipes } from '@nestjs/common';
import { GetCountriesHandler } from '#shared/application/get-countries/get-countries.handler';
import { GetCountriesResponse } from '#shared/infrastructure/controller/country/get-countries.response';
import { CountryResponse } from '#shared/infrastructure/controller/country/get-country.response';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { GetCountriesQuery } from '#shared/application/get-countries/get-countries.query';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getCountriesSchema } from '#shared/infrastructure/config/validation-schema/get-countries.schema';

type GetCountriesQueryParams = {
  filter: string;
};

@Controller('country')
export class GetCountryController {
  constructor(private readonly handler: GetCountriesHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @UsePipes(new JoiRequestQueryParamValidationPipeService(getCountriesSchema))
  async getAll(
    @Query() queryParams: GetCountriesQueryParams,
  ): Promise<CountryResponse[]> {
    const query = new GetCountriesQuery(queryParams.filter);
    const countries = await this.handler.handle(query);

    return GetCountriesResponse.create(countries);
  }
}
