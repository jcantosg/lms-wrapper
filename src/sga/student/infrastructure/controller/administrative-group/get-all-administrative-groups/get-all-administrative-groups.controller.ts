import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetAllAdministrativeGroupsHandler } from '#student/application/administrative-group/get-all-administrative-groups/get-all-administrative-groups.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { GetAllAdministrativeGroupsQuery } from '#student/application/administrative-group/get-all-administrative-groups/get-all-administrative-groups.query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { getAllAdministrativeGroupsSchema } from '#student/infrastructure/config/validation-schema/get-all-administrative-groups.schema';
import {
  GetAdministrativeGroupResponse,
  GetAllAdministrativeGroupsResponse,
} from '#student/infrastructure/controller/administrative-group/get-all-administrative-groups/get-all-administrative-groups.response';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';

type GetAllAdministrativeGroupsQueryParams = {
  page: number;
  limit: number;
  orderBy: string;
  orderType: OrderTypes;
  code?: string;
  academicProgram?: string;
  academicPeriod?: string;
  businessUnit?: string;
  startMonth?: MonthEnum;
  academicYear?: string;
  blockName?: string;
};

@Controller('administrative-group')
export class GetAllAdministrativeGroupsController {
  constructor(private readonly handler: GetAllAdministrativeGroupsHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.JEFATURA,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
    AdminUserRoles.SECRETARIA,
  )
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getAllAdministrativeGroupsSchema,
    ),
  )
  async getAllAdministrativeGroups(
    @Req() req: AuthRequest,
    @Query() queryParams: GetAllAdministrativeGroupsQueryParams,
  ): Promise<CollectionResponse<GetAdministrativeGroupResponse>> {
    const query = new GetAllAdministrativeGroupsQuery(
      req.user,
      queryParams.page,
      queryParams.limit,
      queryParams.orderBy,
      queryParams.orderType,
      queryParams.code,
      queryParams.academicProgram,
      queryParams.academicPeriod,
      queryParams.businessUnit,
      queryParams.startMonth,
      queryParams.academicYear,
      queryParams.blockName,
    );

    const response = await this.handler.handle(query);

    return GetAllAdministrativeGroupsResponse.create(
      response.items,
      queryParams.page,
      queryParams.limit,
      response.total,
    );
  }
}
