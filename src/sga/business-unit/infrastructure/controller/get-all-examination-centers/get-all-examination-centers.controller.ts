import { Controller, Get, Query, UseGuards, UsePipes } from '@nestjs/common';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { GetAllExaminationCentersHandler } from '#business-unit/application/get-all-examination-centers/get-all-examination-centers.handler';
import { getAllExaminationCentersSchema } from '#business-unit/infrastructure/config/validation-schema/get-all-examination-centers.schema';
import { GetAllExaminationCentersQuery } from '#business-unit/application/get-all-examination-centers/get-all-examination-centers.query';
import { GetAllExaminationCentersResponse } from '#business-unit/infrastructure/controller/get-all-examination-centers/get-all-examination-centers.response';
import { ExaminationCenterResponse } from '#business-unit/infrastructure/controller/get-examination-center/get-examination-center.response';

type GetAllExaminationCentersQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  name?: string;
  code?: string;
  isActive?: boolean;
  country?: string;
  address?: string;
  businessUnits?: string[];
  classrooms?: string[];
};

@Controller('examination-center')
export class GetAllExaminationCentersController {
  constructor(private readonly handler: GetAllExaminationCentersHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getAllExaminationCentersSchema,
    ),
  )
  async getAllExaminationCenters(
    @Query() queryParams: GetAllExaminationCentersQueryParams,
  ): Promise<CollectionResponse<ExaminationCenterResponse>> {
    const query = new GetAllExaminationCentersQuery(
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.name,
      queryParams.code,
      queryParams.isActive,
      queryParams.address,
      queryParams.country,
      queryParams.businessUnits,
      queryParams.classrooms,
    );

    const response = await this.handler.handle(query);

    return GetAllExaminationCentersResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
