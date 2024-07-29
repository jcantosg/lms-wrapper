import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GetChatsStudentsHandler } from '#/teacher/application/chat/get-chats-students/get-chats-students.handler';
import { EdaeUserJwtAuthGuard } from '#/teacher/infrastructure/auth/edae-user-jwt-auth.guard';
import { EdaeUserAuthRequest } from '#shared/infrastructure/http/request';
import { GetChatsStudentsQuery } from '#/teacher/application/chat/get-chats-students/get-chats-students.query';
import {
  GetChatsStudentsResponse,
  GetChatStudentResponseBody,
} from '#/teacher/infrastructure/controller/get-chats-students/get-chats-students.response';
import { getChatsStudentsSchema } from '#/teacher/infrastructure/config/validation-schema/get-chats-students.schema';
import { JoiRequestQueryParamValidationPipeService } from '#shared/infrastructure/pipe/joi-request-query-param-validation-pipe.service';

type GetChatsStudentsQueryParams = {
  businessUnitId: string;
  academicPeriodId: string;
  titleId: string;
  subjectId: string;
};

@Controller('edae-360')
export class GetChatsStudentsController {
  constructor(private readonly handler: GetChatsStudentsHandler) {}

  @Get('student-chat')
  @UseGuards(EdaeUserJwtAuthGuard)
  @UsePipes(
    new JoiRequestQueryParamValidationPipeService(getChatsStudentsSchema),
  )
  async getChatsStudents(
    @Query() queryParams: GetChatsStudentsQueryParams,
    @Request() req: EdaeUserAuthRequest,
  ): Promise<GetChatStudentResponseBody[]> {
    const query = new GetChatsStudentsQuery(
      req.user,
      queryParams.businessUnitId,
      queryParams.academicPeriodId,
      queryParams.titleId,
      queryParams.subjectId,
    );

    const response = await this.handler.handle(query);

    return GetChatsStudentsResponse.create(response);
  }
}
