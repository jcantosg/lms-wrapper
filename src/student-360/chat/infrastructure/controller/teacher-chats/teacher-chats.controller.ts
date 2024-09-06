import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { TeacherChatsHandler } from '#student-360/chat/application/teacher-chats/teacher-chats.handler';
import { StudentJwtAuthGuard } from '#student-360/student/infrastructure/auth/student-jwt-auth.guard';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { TeacherChatsQuery } from '#student-360/chat/application/teacher-chats/teacher-chats.query';
import { TeacherChatResponse } from '#student-360/chat/infrastructure/controller/teacher-chats/teacher-chats.response';

@Controller('student-360')
export class TeacherChatsController {
  constructor(private readonly handler: TeacherChatsHandler) {}

  @Get('teacher-chat')
  @UseGuards(StudentJwtAuthGuard)
  async getTeacherChats(
    @Request() req: StudentAuthRequest,
  ): Promise<TeacherChatResponse[]> {
    const query = new TeacherChatsQuery(req.user);

    const response = await this.handler.handle(query);

    return TeacherChatResponse.create(response);
  }
}
