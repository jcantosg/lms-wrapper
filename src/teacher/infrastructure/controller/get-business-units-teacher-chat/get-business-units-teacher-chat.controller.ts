import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { EdaeUserJwtAuthGuard } from '#/teacher/infrastructure/auth/edae-user-jwt-auth.guard';
import { GetBusinessUnitsTeacherChatHandler } from '#/teacher/application/chat/get-business-units-teacher-chat/get-business-units-teacher-chat.hander';
import { EdaeUserAuthRequest } from '#shared/infrastructure/http/request';
import { GetBusinessUnitsTeacherChatQuery } from '#/teacher/application/chat/get-business-units-teacher-chat/get-business-units-teacher-chat.query';
import {
  BusinessUnitTeacherChatResponse,
  GetBusinessUnitsTeacherChatResponse,
} from '#/teacher/infrastructure/controller/get-business-units-teacher-chat/get-business-units-teacher-chat.response';

@Controller('edae-360')
export class GetBusinessUnitsTeacherChatController {
  constructor(private readonly handler: GetBusinessUnitsTeacherChatHandler) {}

  @Get('student-chat/business-unit')
  @UseGuards(EdaeUserJwtAuthGuard)
  async getBusinessUnitsTeacherChat(
    @Request() req: EdaeUserAuthRequest,
  ): Promise<BusinessUnitTeacherChatResponse[]> {
    const query = new GetBusinessUnitsTeacherChatQuery(req.user);

    const response = await this.handler.handle(query);

    return GetBusinessUnitsTeacherChatResponse.create(response);
  }
}
