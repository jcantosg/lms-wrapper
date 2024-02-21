import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { GetAllPlainExaminationCentersHandler } from '#business-unit/application/examination-center/get-all-plain-examination-centers/get-all-plain-examination-centers.handler';
import {
  ExaminationCenterBaseResponse,
  GetAllPlainExaminationCentersResponse,
} from '#business-unit/infrastructure/controller/examination-center/get-all-plain-examination-centers/get-all-plain-examination-centers.response';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { GetAllPlainExaminationCentersQuery } from '#business-unit/application/examination-center/get-all-plain-examination-centers/get-all-plain-examination-centers.query';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

@Controller('examination-center')
export class GetAllPlainExaminationCentersController {
  constructor(private readonly handler: GetAllPlainExaminationCentersHandler) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllExaminationCenters(
    @Req() req: AuthRequest,
  ): Promise<ExaminationCenterBaseResponse[]> {
    const query = new GetAllPlainExaminationCentersQuery(
      req.user.businessUnits,
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );
    const response = await this.handler.handle(query);

    return GetAllPlainExaminationCentersResponse.create(response);
  }
}
