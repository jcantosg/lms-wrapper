import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetAcademicPeriodHandler } from '#academic-offering/applicaton/get-academic-period/get-academic-period.handler';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { GetAcademicPeriodQuery } from '#academic-offering/applicaton/get-academic-period/get-academic-period.query';
import { GetAcademicPeriodResponse } from '#academic-offering/infrastructure/controller/get-academic-period.response';

@Controller('academic-period')
export class GetAcademicPeriodController {
  constructor(private handler: GetAcademicPeriodHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  @Roles(AdminUserRoles.SUPERADMIN, AdminUserRoles.SUPERVISOR_360)
  @Get(':id')
  async getAcademicPeriod(@Param('id') id: string, @Req() req: AuthRequest) {
    const query = new GetAcademicPeriodQuery(
      id,
      req.user.businessUnits.map((bu) => bu.id),
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    const academicPeriod = await this.handler.handle(query);

    return GetAcademicPeriodResponse.create(academicPeriod);
  }
}
