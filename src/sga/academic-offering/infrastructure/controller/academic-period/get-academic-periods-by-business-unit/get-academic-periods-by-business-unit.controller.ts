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
import { GetAcademicPeriodsByBusinessUnitHandler } from '#academic-offering/applicaton/academic-period/get-academic-periods-by-business-unit/get-academic-periods-by-business-unit.handler';
import { GetAcademicPeriodsByBusinessUnitQuery } from '#academic-offering/applicaton/academic-period/get-academic-periods-by-business-unit/get-academic-periods-by-business-unit.query';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getAcademicPeriodsByBusinessUnitSchema } from '#academic-offering/infrastructure/config/validation-schema/get-academic-periods-by-business-unit.schema';
import { GetAcademicPeriodsByBusinessUnitResponse } from '#academic-offering/infrastructure/controller/academic-period/get-academic-periods-by-business-unit/get-academic-periods-by-business-unit.response';

type GetAllAcademicPeriodsQueryParams = {
  businessUnitIds: string[];
};

@Controller('/academic-period')
export class GetAcademicPeriodsByBusinessUnitController {
  constructor(
    private readonly handler: GetAcademicPeriodsByBusinessUnitHandler,
  ) {}

  @Get('/by-business-units')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getAcademicPeriodsByBusinessUnitSchema,
    ),
  )
  @Roles(AdminUserRoles.SUPERADMIN, AdminUserRoles.SUPERVISOR_360)
  async getAcademicPeriodsByBusinessUnit(
    @Req() req: AuthRequest,
    @Query() queryParams: GetAllAcademicPeriodsQueryParams,
  ) {
    const query = new GetAcademicPeriodsByBusinessUnitQuery(
      queryParams.businessUnitIds,
      req.user,
    );

    const response = await this.handler.handle(query);

    return GetAcademicPeriodsByBusinessUnitResponse.create(response);
  }
}
