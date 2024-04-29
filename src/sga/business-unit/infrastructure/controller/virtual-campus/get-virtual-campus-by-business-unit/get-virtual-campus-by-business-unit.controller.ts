import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetVirtualCampusByBusinessUnitHandler } from '#business-unit/application/virtual-campus/get-virtual-campus-by-business-unit/get-virtual-campus-by-business-unit.handler';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { GetVirtualCampusByBusinessUnitQuery } from '#business-unit/application/virtual-campus/get-virtual-campus-by-business-unit/get-virtual-campus-by-business-unit.query';
import { getVirtualCampusByBusinessUnitSchema } from '#business-unit/infrastructure/config/validation-schema/get-virtual-campus-by-business-unit.schema';
import {
  GetVirtualCampusByBusinessUnitResponse,
  VirtualCampusBasicInfoResponse,
} from '#business-unit/infrastructure/controller/virtual-campus/get-virtual-campus-by-business-unit/get-virtual-campus-by-business-unit.response';

type GetVirtualCampusByBusinessUnitParams = {
  businessUnit: string;
};

@Controller('virtual-campus')
export class GetVirtualCampusByBusinessUnitController {
  constructor(private handler: GetVirtualCampusByBusinessUnitHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getVirtualCampusByBusinessUnitSchema,
    ),
  )
  @Roles(AdminUserRoles.SUPERADMIN, AdminUserRoles.SUPERVISOR_360)
  @Get()
  async getVirtualCampusByBusinessUnit(
    @Query() queryParams: GetVirtualCampusByBusinessUnitParams,
    @Req() req: AuthRequest,
  ): Promise<VirtualCampusBasicInfoResponse[]> {
    const query = new GetVirtualCampusByBusinessUnitQuery(
      queryParams.businessUnit,
      req.user,
    );

    const response = await this.handler.handle(query);

    return GetVirtualCampusByBusinessUnitResponse.create(response);
  }
}
