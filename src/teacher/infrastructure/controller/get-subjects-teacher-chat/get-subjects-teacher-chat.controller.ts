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
import { GetSubjectsTeacherChatHandler } from '#/teacher/application/chat/get-subjects-teacher-chat/get-subjects-teacher-chat.handler';
import { GetSubjectsTeacherChatQuery } from '#/teacher/application/chat/get-subjects-teacher-chat/get-subjects-teacher-chat.query';
import { getSubjectsTeacherChatSchema } from '#/teacher/infrastructure/config/validation-schema/get-subjects-teacher-chat.schema';
import { GetSubjectsTeacherChatResponse } from '#/teacher/infrastructure/controller/get-subjects-teacher-chat/get-subjects-teacher-chat.response';

type GetSubjectsTeacherChatQueryParams = {
  titleId: string;
};

@Controller('edae-360')
export class GetSubjectsTeacherChatController {
  constructor(private readonly handler: GetSubjectsTeacherChatHandler) {}

  @Get('student-chat/subject')
  @UseGuards(EdaeUserJwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getSubjectsTeacherChatSchema),
  )
  async getSubjectsTeacherChat(
    @Query() queryParams: GetSubjectsTeacherChatQueryParams,
    @Request() req: EdaeUserAuthRequest,
  ) {
    const query = new GetSubjectsTeacherChatQuery(
      req.user,
      queryParams.titleId,
    );

    const response = await this.handler.handle(query);

    return GetSubjectsTeacherChatResponse.create(response);
  }
}
