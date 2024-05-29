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
import { GetAllInternalGroupsResponse } from '#academic-offering/infrastructure/controller/academic-program/get-all-internal-groups/get-all-internal-groups.response';
import { SearchInternalGroupsHandler } from '#academic-offering/applicaton/academic-program/search-internal-groups/search-internal-groups.handler';
import { searchInternalGroupsSchema } from '#academic-offering/infrastructure/config/validation-schema/search-internal-groups.schema';
import { SearchInternalGroupsQuery } from '#academic-offering/applicaton/academic-program/search-internal-groups/search-internal-groups.query';

interface SearchInternalGroupsQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
}

@Controller('academic-program')
export class SearchInternalGroupsController {
  constructor(private readonly handler: SearchInternalGroupsHandler) {}

  @Get(':id/internal-group/search')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(searchInternalGroupsSchema),
  )
  async searchInternalGroups(
    @Param('id') academicProgramId: string,
    @Query() params: SearchInternalGroupsQueryParams,
    @Request() request: AuthRequest,
  ): Promise<CollectionResponse<GetAllInternalGroupsResponse>> {
    const query = new SearchInternalGroupsQuery(
      academicProgramId,
      params.text,
      params.page,
      params.limit,
      params.orderBy,
      params.orderType,
      request.user,
    );

    const response = await this.handler.handle(query);

    return GetAllInternalGroupsResponse.create(
      response.items,
      params.page,
      params.limit,
      response.total,
    );
  }
}
