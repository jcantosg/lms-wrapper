import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EdaeUserJwtAuthGuard } from '#/teacher/infrastructure/auth/edae-user-jwt-auth.guard';
import {
  GetChatsStudentsResponse,
  GetChatStudentResponseBody,
} from '#/teacher/infrastructure/controller/get-chats-students/get-chats-students.response';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';
import { getUnreadChatsStudentsSchema } from '#/teacher/infrastructure/config/validation-schema/get-unread-chats-students.schema';
import { EdaeUserAuthRequest } from '#shared/infrastructure/http/request';
import { GetUnreadChatsStudentsQuery } from '#/teacher/application/chat/get-unread-chats-students/get-unread-chats-students.query';
import { GetUnreadChatsStudentsHandler } from '#/teacher/application/chat/get-unread-chats-students/get-unread-chats-students.handler';

type GetUnreadChatsStudentsQueryParams = {
  fbChatroomIds: string[];
};

@Controller('edae-360')
export class GetUnreadChatsStudentsController {
  constructor(private readonly handler: GetUnreadChatsStudentsHandler) {}

  @Get('student-chat/unread')
  @UseGuards(EdaeUserJwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getUnreadChatsStudentsSchema),
  )
  async getUnreadChatsStudents(
    @Query() queryParams: GetUnreadChatsStudentsQueryParams,
    @Request() req: EdaeUserAuthRequest,
  ): Promise<GetChatStudentResponseBody[]> {
    const query = new GetUnreadChatsStudentsQuery(
      queryParams.fbChatroomIds,
      req.user,
    );

    const response = await this.handler.handle(query);

    return GetChatsStudentsResponse.create(response);
  }
}
