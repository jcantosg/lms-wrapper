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
import { GetAcademicPeriodsByBusinessUnitResponse } from '#academic-offering/infrastructure/controller/academic-period/get-academic-periods-by-business-unit/get-academic-periods-by-business-unit.response';
import { getAcademicPeriodsBySingleBusinessUnitSchema } from '#academic-offering/infrastructure/config/validation-schema/get-academic-periods-by-single-business-unit.schema';

type GetAllAcademicPeriodsQueryParams = {
  businessUnit: string;
};

@Controller('/academic-period')
export class GetAcademicPeriodsBySingleBusinessUnitController {
  constructor(
    private readonly handler: GetAcademicPeriodsByBusinessUnitHandler,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getAcademicPeriodsBySingleBusinessUnitSchema,
    ),
  )
  @Roles(AdminUserRoles.SUPERADMIN, AdminUserRoles.SUPERVISOR_360)
  @Get('all')
  async GetAcademicPeriodsByBusinessUnit(
    @Req() req: AuthRequest,
    @Query() queryParams: GetAllAcademicPeriodsQueryParams,
  ) {
    const query = new GetAcademicPeriodsByBusinessUnitQuery(
      [queryParams.businessUnit],
      req.user,
    );

    const response = await this.handler.handle(query);

    return GetAcademicPeriodsByBusinessUnitResponse.create(response);
  }
}
