import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetAdminUserDetailHandler } from '#admin-user/application/get-admin-user-detail/get-admin-user-detail.handler';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { GetAdminUserDetailQuery } from '#admin-user/application/get-admin-user-detail/get-admin-user-detail.query';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { GetAdminUserDetailResponse } from './get-admin-user-detail.response';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';

@Controller('admin-user')
export class GetAdminUserDetailController {
  constructor(private readonly handler: GetAdminUserDetailHandler) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    AdminUserRoles.SUPERADMIN,
    AdminUserRoles.SUPERVISOR_360,
    AdminUserRoles.SUPERVISOR_JEFATURA,
    AdminUserRoles.SUPERVISOR_SECRETARIA,
  )
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getAdminUser(@Param('id') id: string, @Req() req: AuthRequest) {
    const query = new GetAdminUserDetailQuery(
      id,
      req.user.businessUnits.map((bu) => bu.id),
      req.user.roles,
    );

    const adminUser = await this.handler.handle(query);

    return GetAdminUserDetailResponse.create(adminUser);
  }
}
