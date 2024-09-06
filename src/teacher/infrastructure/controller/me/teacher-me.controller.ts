import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { EdaeUserJwtAuthGuard } from '#/teacher/infrastructure/auth/edae-user-jwt-auth.guard';
import { EdaeUserAuthRequest } from '#shared/infrastructure/http/request';
import { TeacherMeResponse } from '#/teacher/infrastructure/controller/me/teacher-me.response';

@Controller('edae-360')
export class TeacherMeController {
  @Get('me')
  @UseGuards(EdaeUserJwtAuthGuard)
  async getMe(@Request() req: EdaeUserAuthRequest): Promise<TeacherMeResponse> {
    return TeacherMeResponse.create(req.user);
  }
}
