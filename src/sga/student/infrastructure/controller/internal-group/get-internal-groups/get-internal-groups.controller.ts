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
import { getInternalGroupsSchema } from '#student/infrastructure/config/validation-schema/get-internal-groups.schema';
import { GetInternalGroupsHandler } from '#student/application/get-internal-groups/get-internal-groups.handler';
import { GetInternalGroupsQuery } from '#student/application/get-internal-groups/get-internal-groups.query';

interface GetInternalGroupsQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  code: string | null;
  academicPeriod: string | null;
  academicProgram: string | null;
  businessUnit: string | null;
  startDate: string | null;
  subject: string | null;
}

@Controller('internal-group')
export class GetInternalGroupsController {
  constructor(private readonly handler: GetInternalGroupsHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getInternalGroupsSchema),
  )
  async getInternalGroups(
    @Query() params: GetInternalGroupsQueryParams,
    @Request() request: AuthRequest,
  ): Promise<CollectionResponse<GetInternalGroupsResponse>> {
    const query = new GetInternalGroupsQuery(
      params.startDate,
      params.academicPeriod,
      params.code,
      params.businessUnit,
      params.academicProgram,
      params.subject,
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
