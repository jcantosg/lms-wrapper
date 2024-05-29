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
import { getAllInternalGroupsSchema } from '#academic-offering/infrastructure/config/validation-schema/get-all-internal-groups.schema';
import { GetAllInternalGroupsResponse } from '#academic-offering/infrastructure/controller/academic-program/get-all-internal-groups/get-all-internal-groups.response';
import { GetAllInternalGroupsQuery } from '#academic-offering/applicaton/academic-program/get-all-internal-groups/get-all-internal-groups.query';
import { GetAllInternalGroupsHandler } from '#academic-offering/applicaton/academic-program/get-all-internal-groups/get-all-internal-groups.handler';

interface GetAllInternalGroupsQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  academicPeriod: string | null;
  subject: string | null;
}

@Controller('academic-program')
export class GetAllInternalGroupsController {
  constructor(private readonly handler: GetAllInternalGroupsHandler) {}

  @Get(':id/internal-group')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getAllInternalGroupsSchema),
  )
  async getAllInternalGroups(
    @Param('id') academicProgramId: string,
    @Query() params: GetAllInternalGroupsQueryParams,
    @Request() request: AuthRequest,
  ): Promise<CollectionResponse<GetAllInternalGroupsResponse>> {
    const query = new GetAllInternalGroupsQuery(
      academicProgramId,
      params.academicPeriod,
      params.subject,
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
