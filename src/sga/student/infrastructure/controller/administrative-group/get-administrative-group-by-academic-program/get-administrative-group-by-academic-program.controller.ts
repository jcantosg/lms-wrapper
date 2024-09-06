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
import { GetAdministrativeGroupByAcademicProgramHandler } from '#student/application/administrative-group/get-administrative-group-by-academic-program/get-administrative-group-by-academic-program.handler';
import { getAdministrativeGroupByAcademicProgramSchema } from '#student/infrastructure/config/validation-schema/get-administrative-group-by-academic-program.schema';
import { GetAdministrativeGroupByAcademicProgramResponse } from '#student/infrastructure/controller/administrative-group/get-administrative-group-by-academic-program/get-administrative-group-by-academic-program.response';
import { GetAdministrativeGroupByAcademicProgramQuery } from '#student/application/administrative-group/get-administrative-group-by-academic-program/get-administrative-group-by-academic-program.query';

type GetAdministrativeGroupByAcademicProgramQueryParams = {
  currentAdministrativeGroupId: string;
  academicProgramId: string;
};

@Controller('administrative-group/plain')
export class GetAdministrativeGroupByAcademicProgramController {
  constructor(
    private readonly handler: GetAdministrativeGroupByAcademicProgramHandler,
  ) {}

  @Get()
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
      getAdministrativeGroupByAcademicProgramSchema,
    ),
  )
  async getAdministrativeGroups(
    @Query() queryParam: GetAdministrativeGroupByAcademicProgramQueryParams,
    @Req() req: AuthRequest,
  ): Promise<GetAdministrativeGroupByAcademicProgramResponse[]> {
    const query = new GetAdministrativeGroupByAcademicProgramQuery(
      queryParam.academicProgramId,
      queryParam.currentAdministrativeGroupId,
      req.user,
    );

    const response = await this.handler.handle(query);

    return GetAdministrativeGroupByAcademicProgramResponse.create(response);
  }
}
