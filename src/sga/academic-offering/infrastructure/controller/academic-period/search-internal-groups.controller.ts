import {
  Controller,
  Get,
  Param,
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
import { GetInternalGroupsResponse } from '#academic-offering/infrastructure/controller/academic-period/get-internal-groups/get-internal-groups.response';
import { searchInternalGroupsByPeriodSchema } from '#academic-offering/infrastructure/config/validation-schema/search-internal-groups-by-period.schema';
import { SearchInternalGroupsHandler } from '#academic-offering/applicaton/academic-period/search-internal-groups/search-internal-groups.handler';
import { SearchInternalGroupsQuery } from '#academic-offering/applicaton/academic-period/search-internal-groups/search-internal-groups.query';

interface SearchInternalGroupQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
}

@Controller('academic-period')
export class SearchInternalGroupsController {
  constructor(private readonly handler: SearchInternalGroupsHandler) {}

  @Get(':id/internal-group/search')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      searchInternalGroupsByPeriodSchema,
    ),
  )
  async getInternalGroups(
    @Param('id') academicPeriodId: string,
    @Query() params: SearchInternalGroupQueryParams,
    @Request() request: AuthRequest,
  ): Promise<CollectionResponse<GetInternalGroupsResponse>> {
    const query = new SearchInternalGroupsQuery(
      academicPeriodId,
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
