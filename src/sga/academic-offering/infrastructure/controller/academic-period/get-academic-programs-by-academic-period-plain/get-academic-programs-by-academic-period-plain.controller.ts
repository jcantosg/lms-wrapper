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
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { GetAcademicProgramsByAcademicPeriodPlainResponse } from '#academic-offering/infrastructure/controller/academic-period/get-academic-programs-by-academic-period-plain/get-academic-programs-by-academic-period-plain.response';
import { GetAcademicPeriodHandler } from '#academic-offering/applicaton/academic-period/get-academic-period/get-academic-period.handler';
import { GetAcademicPeriodQuery } from '#academic-offering/applicaton/academic-period/get-academic-period/get-academic-period.query';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

@Controller('/academic-period')
export class GetAcademicProgramsByAcademicPeriodPlainController {
  constructor(private readonly handler: GetAcademicPeriodHandler) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  @Get(':academicPeriodId/academic-program/plain')
  async GetAcademicProgramsByAcademicPeriodPlain(
    @Param('academicPeriodId') academicPeriodId: string,
    @Req() req: AuthRequest,
  ) {
    const query = new GetAcademicPeriodQuery(
      academicPeriodId,
      req.user.businessUnits.map((bu) => bu.id),
      req.user.roles.includes(AdminUserRoles.SUPERADMIN),
    );

    const response = await this.handler.handle(query);

    return GetAcademicProgramsByAcademicPeriodPlainResponse.create(response);
  }
}
