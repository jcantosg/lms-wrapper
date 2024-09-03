import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetAcademicProgramsByPeriodsQuery } from '#academic-offering/applicaton/academic-program/get-academic-programs-by-multiple-periods/get-academic-programs-by-multiple-periods.query';
import { AcademicProgramsByPeriodsResponse } from '#academic-offering/infrastructure/controller/academic-program/get-academic-programs-by-multiple-periods/get-academic-programs-by-multiple-periods.response';
import { getAcademicProgramByMultiplePeriodsSchema } from '#student/infrastructure/config/validation-schema/get-academic-programs-by-multiple-periods.schema';
import { GetAcademicProgramsByPeriodsHandler } from '#academic-offering/applicaton/academic-program/get-academic-programs-by-multiple-periods/get-academic-programs-by-multiple-periods.handler';

type GetAcademicProgramsByPeriodsQueryParams = {
  academicPeriods: string[];
  titles: string[];
};

@Controller('academic-program')
export class GetAcademicProgramsByPeriodsController {
  constructor(private readonly handler: GetAcademicProgramsByPeriodsHandler) {}

  @Get('by-periods')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.GESTOR_360,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
  )
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getAcademicProgramByMultiplePeriodsSchema,
    ),
  )
  async list(
    @Query() queryParams: GetAcademicProgramsByPeriodsQueryParams,
    @Req() req: AuthRequest,
  ): Promise<AcademicProgramsByPeriodsResponse> {
    const query = new GetAcademicProgramsByPeriodsQuery(
      queryParams.academicPeriods,
      queryParams.titles,
      req.user,
    );

    const response = await this.handler.handle(query);

    return AcademicProgramsByPeriodsResponse.create(response);
  }
}
