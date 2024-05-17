import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import {
  GetAdministrativeGroupResponse,
  GetAllAdministrativeGroupsResponse,
} from '#student/infrastructure/controller/administrative-group/get-all-administrative-groups/get-all-administrative-groups.response';
import { SearchAdministrativeGroupsQuery } from '#student/application/administrative-group/search-administrative-groups/search-administrative-groups.query';
import { SearchAdministrativeGroupsHandler } from '#student/application/administrative-group/search-administrative-groups/search-administrative-groups.handler';
import { searchAdministrativeGroupsSchema } from '#student/infrastructure/config/validation-schema/search-administrative-groups.schema';

type GetAllAdministrativeGroupsQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
};

@Controller('administrative-group/search')
export class SearchAdministrativeGroupsController {
  constructor(private readonly handler: SearchAdministrativeGroupsHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      searchAdministrativeGroupsSchema,
    ),
  )
  async getAllAdministrativeGroups(
    @Req() req: AuthRequest,
    @Query() queryParams: GetAllAdministrativeGroupsQueryParams,
  ): Promise<CollectionResponse<GetAdministrativeGroupResponse>> {
    const query = new SearchAdministrativeGroupsQuery(
      req.user,
      queryParams.text,
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
    );

    const response = await this.handler.handle(query);

    return GetAllAdministrativeGroupsResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
