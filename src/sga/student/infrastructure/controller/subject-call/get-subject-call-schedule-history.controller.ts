import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthRequest } from '#shared/infrastructure/http/request';
import { JwtAuthGuard } from '#/sga/shared/infrastructure/auth/jwt-auth.guard';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getSubjectCallScheduleHistorySchema } from '#student/infrastructure/config/validation-schema/get-subject-call-schedule-history.schema';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import {
  GetSubjectCallScheduleHistoryResponse,
  GetSubjectCallsScheduleHistoryResponse,
} from '#student/infrastructure/controller/subject-call/get-subject-call-schedule-history.response';
import { GetSubjectCallScheduleHistoryQuery } from '#student/application/subject-call/get-subject-call-schedule-hisotry/get-subject-call-schedule-hisotry.query';
import { GetSubjectCallScheduleHistoryHandler } from '#student/application/subject-call/get-subject-call-schedule-hisotry/get-subject-call-schedule-hisotry.handler';

interface GetSubjectCallScheduleHistoryQueryParams {
  orderBy: string;
  orderType: OrderTypes;
  year: number;
}

@Controller('subject-call-schedule-history')
export class GetSubjectCallScheduleHistoryController {
  constructor(private readonly handler: GetSubjectCallScheduleHistoryHandler) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getSubjectCallScheduleHistorySchema,
    ),
  )
  async getSubjectCallScheduleHistory(
    @Query() params: GetSubjectCallScheduleHistoryQueryParams,
    @Request() request: AuthRequest,
  ): Promise<GetSubjectCallScheduleHistoryResponse[]> {
    const query = new GetSubjectCallScheduleHistoryQuery(
      params.orderBy,
      params.orderType,
      params.year,
      request.user,
    );

    const response = await this.handler.handle(query);

    return GetSubjectCallsScheduleHistoryResponse.create(response);
  }
}
