import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetAllBusinessUnitsHandler } from '#business-unit/application/business-unit/get-all-business-units/get-all-business-units.handler';
import { GetAllBusinessUnitsQuery } from '#business-unit/application/business-unit/get-all-business-units/get-all-business-units.query';
import { getAllBusinessUnitSchema } from '#business-unit/infrastructure/config/validation-schema/get-all-business-units.schema';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { GetAllBusinessUnitResponse } from '#business-unit/infrastructure/controller/business-unit/get-all-business-units/get-all-business-units.response';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { BusinessUnitResponse } from '#business-unit/infrastructure/controller/business-unit/get-all-business-units/get-business-unit.response';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AuthRequest } from '#shared/infrastructure/http/request';

type GetAllBusinessUnitsQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  name?: string;
  code?: string;
  isActive?: boolean;
  country?: string;
};

@Controller('business-unit')
export class GetAllBusinessController {
  constructor(private readonly handler: GetAllBusinessUnitsHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getAllBusinessUnitSchema),
  )
  async getAllBusinessUnits(
    @Query() queryParams: GetAllBusinessUnitsQueryParams,
    @Req() req: AuthRequest,
  ): Promise<CollectionResponse<BusinessUnitResponse>> {
    const query = new GetAllBusinessUnitsQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      req.user.businessUnits.map((bu) => bu.id),
      queryParams.name,
      queryParams.code,
      queryParams.isActive,
      queryParams.country,
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
