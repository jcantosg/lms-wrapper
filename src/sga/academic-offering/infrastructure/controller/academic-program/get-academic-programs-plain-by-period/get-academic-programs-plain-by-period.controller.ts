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
import { ListAcademicProgramsByPeriodResponse } from '#academic-offering/infrastructure/controller/academic-program/get-all-academic-program-by-period/list-all-academic-program.response';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { GetAcademicProgramsPlainByPeriodHandler } from '#academic-offering/applicaton/academic-program/get-academic-programs-plain-by-period/get-academic-programs-plain-by-period.handler';
import { GetAcademicProgramsPlainByPeriodQuery } from '#academic-offering/applicaton/academic-program/get-academic-programs-plain-by-period/get-academic-programs-plain-by-period.query';
import { GetAcademicProgramsPlainByPeriodResponse } from '#academic-offering/infrastructure/controller/academic-program/get-academic-programs-plain-by-period/get-academic-programs-plain-by-period.response';

@Controller('academic-period')
export class GetAcademicProgramsPlainByPeriodController {
  constructor(
    private readonly handler: GetAcademicProgramsPlainByPeriodHandler,
  ) {}

  @Get(':academicPeriodId/academic-program/plain')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async list(
    @Req() req: AuthRequest,
    @Param('academicPeriodId') academicPeriodId: string,
  ): Promise<ListAcademicProgramsByPeriodResponse> {
    const query = new GetAcademicProgramsPlainByPeriodQuery(
      academicPeriodId,
      req.user,
    );

    const response = await this.handler.handle(query);

    return GetAcademicProgramsPlainByPeriodResponse.create(response);
  }
}
