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
import { GetAcademicRecordDetailResponse } from '#student/infrastructure/controller/academic-record/get-academic-record-detail.response';
import { GetAcademicRecordDetailHandler } from '#student/application/academic-record/get-academic-record-detail/get-academic-record-detail.handler';
import { GetAcademicRecordDetailQuery } from '#student/application/academic-record/get-academic-record-detail/get-academic-record-detail.query';
import { AuthRequest } from '#shared/infrastructure/http/request';

@Controller('academic-record')
export class AcademicRecordDetailController {
  constructor(private readonly handler: GetAcademicRecordDetailHandler) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getAcademicRecord(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<GetAcademicRecordDetailResponse> {
    const query = new GetAcademicRecordDetailQuery(id, req.user);
    const academicRecord = await this.handler.handle(query);

    return GetAcademicRecordDetailResponse.create(academicRecord);
  }
}
