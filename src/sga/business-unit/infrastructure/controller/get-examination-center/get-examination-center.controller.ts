import { Controller, Get, Param, UseGuards, UsePipes } from '@nestjs/common';
import { GetExaminationCenterHandler } from '#business-unit/application/get-examination-center/get-examination-center.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { GetExaminationCenterQuery } from '#business-unit/application/get-examination-center/get-examination-center.query';
import { GetExaminationCenterResponse } from '#business-unit/infrastructure/controller/get-examination-center/get-examination-center.response';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';

@Controller('examination-center')
export class GetExaminationCenterController {
  constructor(private handler: GetExaminationCenterHandler) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  @Roles(AdminUserRoles.SUPERADMIN)
  @Get(':id')
  async getExaminationCenter(@Param('id') id: string) {
    const query = new GetExaminationCenterQuery(id);
    const examinationCenter = await this.handler.handle(query);

    return GetExaminationCenterResponse.create(examinationCenter);
  }
}
