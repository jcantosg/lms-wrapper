import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { BusinessUnitResponse } from '#business-unit/infrastructure/controller/business-unit/get-all-business-units/get-business-unit.response';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { searchBusinessUnitSchema } from '#business-unit/infrastructure/config/validation-schema/search-business-units.schema';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { SearchBusinessUnitsHandler } from '#business-unit/application/business-unit/search-business-units/search-business-units.handler';
import { SearchBusinessUnitsQuery } from '#business-unit/application/business-unit/search-business-units/search-business-units.query';
import { GetAllBusinessUnitResponse } from './get-all-business-units/get-all-business-units.response';
import { AuthRequest } from '#shared/infrastructure/http/request';

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

  @UseGuards(JwtAuthGuard)
  @Get('search')
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(searchBusinessUnitSchema),
  )
  async searchBusinessUnits(
    @Query() queryParams: SearchBusinessUnitsQueryParams,
    @Req() req: AuthRequest,
  ): Promise<CollectionResponse<BusinessUnitResponse>> {
    const query = new SearchBusinessUnitsQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.text,
      req.user.businessUnits.map((bu) => bu.id),
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
