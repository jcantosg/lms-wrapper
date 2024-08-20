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
import { searchAdministrativeProcessesSchema } from '#student/infrastructure/config/validation-schema/search-administrative-processes.schema';
import {
  GetAdministrativeProcessResponse,
  GetAllAdministrativeProcessesResponse,
} from '#student/infrastructure/controller/administrative-process/get-all-administrative-process/get-all-administrative-process.response';
import { SearchAdministrativeProcessesHandler } from '#student/application/administrative-process/search-administrative-processes/search-administrative-processes.handler';
import { SearchAdministrativeProcessesQuery } from '#student/application/administrative-process/search-administrative-processes/search-administrative-processes.query';

type SearchAdministrativeProcessesQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  text: string;
};

@Controller('administrative-process')
export class SearchAdministrativeProcessesController {
  constructor(private readonly handler: SearchAdministrativeProcessesHandler) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      searchAdministrativeProcessesSchema,
    ),
  )
  async searchAdministrativeProcesses(
    @Req() req: AuthRequest,
    @Query() queryParams: SearchAdministrativeProcessesQueryParams,
  ): Promise<CollectionResponse<GetAdministrativeProcessResponse>> {
    const query = new SearchAdministrativeProcessesQuery(
      req.user,
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.text,
    );

    const response = await this.handler.handle(query);

    return GetAllAdministrativeProcessesResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
