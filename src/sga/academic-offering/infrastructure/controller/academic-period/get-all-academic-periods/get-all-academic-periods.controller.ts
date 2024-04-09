import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AcademicPeriodResponse } from '#academic-offering/infrastructure/controller/academic-period/get-academic-period.response';
import { GetAllAcademicPeriodsResponse } from '#academic-offering/infrastructure/controller/academic-period/get-all-academic-periods/get-all-academic-periods.response';
import { getAllAcademicPeriodsSchema } from '#academic-offering/infrastructure/config/validation-schema/get-all-academic-periods.schema';
import { GetAllAcademicPeriodsQuery } from '#academic-offering/applicaton/academic-period/get-all-academic-periods/get-all-academic-periods.query';
import { GetAllAcademicPeriodsHandler } from '#academic-offering/applicaton/academic-period/get-all-academic-periods/get-all-academic-periods.handler';

type GetAllAcademicPeriodsQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  name?: string;
  code?: string;
  startDate?: Date;
  endDate?: Date;
  businessUnit?: string;
};

@Controller('academic-period')
export class GetAllAcademicPeriodsController {
  constructor(private readonly handler: GetAllAcademicPeriodsHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getAllAcademicPeriodsSchema),
  )
  async getAllAcademicPeriods(
    @Req() req: AuthRequest,
    @Query() queryParams: GetAllAcademicPeriodsQueryParams,
  ): Promise<CollectionResponse<AcademicPeriodResponse>> {
    const query = new GetAllAcademicPeriodsQuery(
      req.user.businessUnits,
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.name,
      queryParams.code,
      queryParams.startDate,
      queryParams.endDate,
      queryParams.businessUnit,
    );

    const response = await this.handler.handle(query);

    return GetAllAcademicPeriodsResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
