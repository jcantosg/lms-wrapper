import { Controller, Get, Query, UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { BusinessUnitResponse } from '#business-unit/infrastructure/controller/get-all-business-units/get-business-unit.response';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { searchBusinessUnitSchema } from '#business-unit/infrastructure/config/validation-schema/search-business-units.schema';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { SearchBusinessUnitsHandler } from '#business-unit/application/search-business-units/search-business-units.handler';
import { SearchBusinessUnitsQuery } from '#business-unit/application/search-business-units/search-business-units.query';
import { GetAllBusinessUnitResponse } from './get-all-business-units/get-all-business-units.response';

type SearchBusinessUnitsQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
};

@Controller('business-unit')
export class SearchBusinessUnitsController {
  constructor(private readonly handler: SearchBusinessUnitsHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @Get('search')
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(searchBusinessUnitSchema),
  )
  async searchBusinessUnits(
    @Query() queryParams: SearchBusinessUnitsQueryParams,
  ): Promise<CollectionResponse<BusinessUnitResponse>> {
    const query = new SearchBusinessUnitsQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.text,
    );

    const response = await this.handler.handle(query);

    return GetAllBusinessUnitResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
