import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { GetInternalGroupsResponse } from '#student/infrastructure/controller/internal-group/get-internal-groups/get-internal-groups.response';
import { searchInternalGroupsSchema } from '#student/infrastructure/config/validation-schema/search-internal-groups.schema';
import { SearchInternalGroupsHandler } from '#student/application/search-internal-groups/search-internal-groups.handler';
import { SearchInternalGroupsQuery } from '#student/application/search-internal-groups/search-internal-groups.query';

interface SearchInternalGroupQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
}

@Controller('internal-group')
export class SearchInternalGroupsController {
  constructor(private readonly handler: SearchInternalGroupsHandler) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(searchInternalGroupsSchema),
  )
  async getInternalGroups(
    @Query() params: SearchInternalGroupQueryParams,
    @Request() request: AuthRequest,
  ): Promise<CollectionResponse<GetInternalGroupsResponse>> {
    const query = new SearchInternalGroupsQuery(
      params.text,
      request.user,
      params.page,
      params.limit,
      params.orderBy,
      params.orderType,
    );

    const response = await this.handler.handle(query);

    return GetInternalGroupsResponse.create(
      response.items,
      params.page,
      params.limit,
      response.total,
    );
  }
}
