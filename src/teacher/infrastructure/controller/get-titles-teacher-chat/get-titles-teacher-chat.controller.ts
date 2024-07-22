import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EdaeUserJwtAuthGuard } from '#/teacher/infrastructure/auth/edae-user-jwt-auth.guard';
import { EdaeUserAuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { GetTitlesTeacherChatQuery } from '#/teacher/application/chat/get-titles-teacher-chat/get-titles-teacher-chat.query';
import { getTitlesTeacherChatSchema } from '#/teacher/infrastructure/config/validation-schema/get-titles-teacher-chat.schema';
import { GetTitlesTeacherChatResponse } from '#/teacher/infrastructure/controller/get-titles-teacher-chat/get-titles-teacher-chat.response';
import { GetTitlesTeacherChatHandler } from '#/teacher/application/chat/get-titles-teacher-chat/get-titles-teacher-chat.handler';

type GetTitlesTeacherChatQueryParams = {
  academicPeriodId: string;
};

@Controller('edae-360')
export class GetTitlesTeacherChatController {
  constructor(private readonly handler: GetTitlesTeacherChatHandler) {}

  @Get('student-chat/title')
  @UseGuards(EdaeUserJwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getTitlesTeacherChatSchema),
  )
  async getTitlesTeacherChat(
    @Query() queryParams: GetTitlesTeacherChatQueryParams,
    @Request() req: EdaeUserAuthRequest,
  ) {
    const query = new GetTitlesTeacherChatQuery(
      req.user,
      queryParams.academicPeriodId,
    );

    const response = await this.handler.handle(query);

    return GetTitlesTeacherChatResponse.create(response);
  }
}
