import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetAdministrativeGroupHandler } from '#student/application/administrative-group/get-administrative-group/get-administrative-group.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetAdministrativeGroupQuery } from '#student/application/administrative-group/get-administrative-group/get-administrative-group.query';
import { GetAdministrativeGroupResponse } from '#student/infrastructure/controller/administrative-group/get-administrative-group/get-administrative-group.response';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';

@Controller('administrative-group')
export class GetAdministrativeGroupController {
  constructor(private readonly handler: GetAdministrativeGroupHandler) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.JEFATURA,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
    AdminUserRoles.SECRETARIA,
  )
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getAdministrativeGroup(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ): Promise<GetAdministrativeGroupResponse> {
    const query = new GetAdministrativeGroupQuery(id, req.user);

    const administrativeGroup = await this.handler.handle(query);

    return GetAdministrativeGroupResponse.create(administrativeGroup);
  }
}
