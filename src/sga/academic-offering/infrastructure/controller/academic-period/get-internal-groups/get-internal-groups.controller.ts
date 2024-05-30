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
import { GetInternalGroupsHandler } from '#academic-offering/applicaton/academic-period/get-internal-groups/get-internal-groups.handler';
import { GetInternalGroupsQuery } from '#academic-offering/applicaton/academic-period/get-internal-groups/get-internal-groups.query';
import { getInternalGroupsByPeriodSchema } from '#academic-offering/infrastructure/config/validation-schema/get-internal-groups-by-period.schema';

interface GetInternalGroupsQueryParams {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  code: string | null;
  academicProgram: string | null;
  businessUnit: string | null;
  startDate: string | null;
  subject: string | null;
}

@Controller('academic-period')
export class GetInternalGroupsController {
  constructor(private readonly handler: GetInternalGroupsHandler) {}

  @Get(':id/internal-group')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getInternalGroupsByPeriodSchema,
    ),
  )
  async getInternalGroups(
    @Param('id') academicPeriodId: string,
    @Query() params: GetInternalGroupsQueryParams,
    @Request() request: AuthRequest,
  ): Promise<CollectionResponse<GetInternalGroupsResponse>> {
    const query = new GetInternalGroupsQuery(
      params.startDate,
      academicPeriodId,
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
