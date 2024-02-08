import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '#/sga/shared/infrastructure/auth/roles.guard';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Roles } from '#/sga/shared/infrastructure/decorators/roles.decorator';
import { GetAllPlainExaminationCentersHandler } from '#business-unit/application/examination-center/get-all-plain-examination-centers/get-all-plain-examination-centers.handler';
import {
  ExaminationCenterBaseResponse,
  GetAllPlainExaminationCentersResponse,
} from '#business-unit/infrastructure/controller/examination-center/get-all-plain-examination-centers/get-all-plain-examination-centers.response';

@Controller('examination-center')
export class GetAllPlainExaminationCentersController {
  constructor(private readonly handler: GetAllPlainExaminationCentersHandler) {}

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminUserRoles.SUPERADMIN)
  async getAllExaminationCenters(): Promise<ExaminationCenterBaseResponse[]> {
    const response = await this.handler.handle();

    return GetAllPlainExaminationCentersResponse.create(response);
  }
}
