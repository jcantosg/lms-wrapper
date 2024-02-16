import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetExaminationCenterHandler } from '#business-unit/application/examination-center/get-examination-center/get-examination-center.handler';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { GetExaminationCenterQuery } from '#business-unit/application/examination-center/get-examination-center/get-examination-center.query';
import { GetExaminationCenterResponse } from '#business-unit/infrastructure/controller/examination-center/get-examination-center/get-examination-center.response';
import { AuthRequest } from '#shared/infrastructure/http/request';

@Controller('examination-center')
export class GetExaminationCenterController {
  constructor(private handler: GetExaminationCenterHandler) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  @Get(':id')
  async getExaminationCenter(@Param('id') id: string, @Req() req: AuthRequest) {
    const query = new GetExaminationCenterQuery(
      id,
      req.user.businessUnits.map((bu) => bu.id),
    );
    const examinationCenter = await this.handler.handle(query);

    return GetExaminationCenterResponse.create(examinationCenter);
  }
}
