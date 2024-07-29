import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetAcademicPeriodsTeacherChatHandler } from '#/teacher/application/chat/get-academic-periods-teacher-chat/get-academic-periods-teacher-chat.handler';
import { EdaeUserJwtAuthGuard } from '#/teacher/infrastructure/auth/edae-user-jwt-auth.guard';
import { EdaeUserAuthRequest } from '#shared/infrastructure/http/request';
import { GetAcademicPeriodsTeacherChatQuery } from '#/teacher/application/chat/get-academic-periods-teacher-chat/get-academic-periods-teacher-chat.query';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getAcademicPeriodsTeacherChatSchema } from '#/teacher/infrastructure/config/validation-schema/get-academic-periods-teacher-chat.schema';
import { GetAcademicPeriodsTeacherChatResponse } from '#/teacher/infrastructure/controller/get-academic-periods-teacher-chat/get-academic-periods-teacher-chat.response';

type GetAcademicPeriodsTeacherChatQueryParams = {
  businessUnitId: string;
};

@Controller('edae-360')
export class GetAcademicPeriodsTeacherChatController {
  constructor(private readonly handler: GetAcademicPeriodsTeacherChatHandler) {}

  @Get('student-chat/academic-period')
  @UseGuards(EdaeUserJwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(
      getAcademicPeriodsTeacherChatSchema,
    ),
  )
  async getAcademicPeriodsTeacherChat(
    @Query() queryParams: GetAcademicPeriodsTeacherChatQueryParams,
    @Request() req: EdaeUserAuthRequest,
  ) {
    const query = new GetAcademicPeriodsTeacherChatQuery(
      req.user,
      queryParams.businessUnitId,
    );

    const response = await this.handler.handle(query);

    return GetAcademicPeriodsTeacherChatResponse.create(response);
  }
}
