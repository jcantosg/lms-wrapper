import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import {
  BusinessUnitExaminationCenterResponse,
  GetBusinessUnitExaminationCentersResponse,
} from '#business-unit/infrastructure/controller/business-unit/get-business-unit-examination-centers/get-business-unit-examination-centers.response';
import { GetBusinessUnitExaminationCentersQuery } from '#business-unit/application/business-unit/get-business-unit-examination-centers/get-business-unit-examination-centers.query';
import { GetBusinessUnitExaminationCentersHandler } from '#business-unit/application/business-unit/get-business-unit-examination-centers/get-business-unit-examination-centers.handler';
import { AuthRequest } from '#shared/infrastructure/http/request';

@Controller('business-unit')
export class GetBusinessUnitExaminationCentersController {
  constructor(
    private readonly handler: GetBusinessUnitExaminationCentersHandler,
  ) {}

  @Get(':id/examination-centers')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getBusinessUnitExaminationCenters(
    @Param('id') businessUnitId: string,
    @Req() req: AuthRequest,
  ): Promise<BusinessUnitExaminationCenterResponse[]> {
    const query = new GetBusinessUnitExaminationCentersQuery(
      businessUnitId,
      req.user.businessUnits.map((bu) => bu.id),
    );

    const response = await this.handler.handle(query);

    return GetBusinessUnitExaminationCentersResponse.create(response);
  }
}
