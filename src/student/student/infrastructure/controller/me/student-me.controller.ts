import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { StudentJwtAuthGuard } from '#/student/student/infrastructure/auth/student-jwt-auth.guard';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { StudentMeResponse } from '#/student/student/infrastructure/controller/me/student-me-response';

@Controller('student-360')
export class StudentMeController {
  @Get('me')
  @UseGuards(StudentJwtAuthGuard)
  async getMe(@Request() req: StudentAuthRequest): Promise<StudentMeResponse> {
    return StudentMeResponse.create(req.user);
  }
}
