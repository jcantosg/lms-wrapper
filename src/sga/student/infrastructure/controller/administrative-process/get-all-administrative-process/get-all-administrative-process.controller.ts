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
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';
import {
  GetAdministrativeProcessResponse,
  GetAllAdministrativeProcessesResponse,
} from '#student/infrastructure/controller/administrative-process/get-all-administrative-process/get-all-administrative-process.response';
import { getAllAdministrativeProcessesSchema } from '#student/infrastructure/config/validation-schema/get-all-administrative-processes.schema';
import { GetAllAdministrativeProcessesQuery } from '#student/application/administrative-process/get-all-administrative-processes/get-all-administrative-processes.query';
import { GetAllAdministrativeProcessesHandler } from '#student/application/administrative-process/get-all-administrative-processes/get-all-administrative-processes.handler';

type GetAllAdministrativeProcessesQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  name?: string;
  businessUnit?: string;
  createdAt?: string;
  updatedAt?: string;
  type?: MonthEnum;
  status?: string;
};

@Controller('administrative-process')
export class GetAllAdministrativeProcessesController {
  constructor(private readonly handler: GetAllAdministrativeProcessesHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getAllAdministrativeProcessesSchema,
    ),
  )
  async getAllAdministrativeProcesses(
    @Req() req: AuthRequest,
    @Query() queryParams: GetAllAdministrativeProcessesQueryParams,
  ): Promise<CollectionResponse<GetAdministrativeProcessResponse>> {
    const query = new GetAllAdministrativeProcessesQuery(
      req.user,
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.name,
      queryParams.businessUnit,
      queryParams.createdAt,
      queryParams.updatedAt,
      queryParams.type,
      queryParams.status,
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
