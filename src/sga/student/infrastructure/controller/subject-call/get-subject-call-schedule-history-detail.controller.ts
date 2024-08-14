import {
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestParamIdValidationPipeService } from '#shared/infrastructure/pipe/joi-request-param-id-validation-pipe.service';
import { uuidSchema } from '#shared/infrastructure/config/validation-schema/uuid.schema';
import {
  GetSubjectCallScheduleHistoryDetail,
  GetSubjectCallScheduleHistoryDetailResponse,
} from '#student/infrastructure/controller/subject-call/get-subject-call-schedule-history-detail.response';
import { GetSubjectCallScheduleHistoryDetailHandler } from '#student/application/subject-call/get-subject-call-schedule-hisotry-detail/get-subject-call-schedule-hisotry-detail.handler';
import { GetSubjectCallScheduleHistoryDetailQuery } from '#student/application/subject-call/get-subject-call-schedule-hisotry-detail/get-subject-call-schedule-hisotry-detail.query';

@Controller('subject-call-schedule-history')
export class GetSubjectCallScheduleHistoryDetailController {
  constructor(
    private readonly handler: GetSubjectCallScheduleHistoryDetailHandler,
  ) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiRequestParamIdValidationPipeService(uuidSchema))
  async getSubjectCallScheduleHistoryDetail(
    @Param('id') id: string,
    @Request() request: AuthRequest,
  ): Promise<GetSubjectCallScheduleHistoryDetail> {
    const query = new GetSubjectCallScheduleHistoryDetailQuery(
      id,
      request.user,
    );

    const response = await this.handler.handle(query);

    return GetSubjectCallScheduleHistoryDetailResponse.create(response);
  }
}
