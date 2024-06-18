import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ExpireStudentRefreshTokenHandler } from '#/student/student/application/expire-refresh-token/expire-student-refresh-token.handler';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { StudentJwtAuthGuard } from '#/student/student/infrastructure/auth/student-jwt-auth.guard';
import { ExpireStudentRefreshTokenCommand } from '#/student/student/application/expire-refresh-token/expire-student-refresh-token.command';

@Controller('student-360')
export class LogoutStudentController {
  constructor(private readonly handler: ExpireStudentRefreshTokenHandler) {}

  @Post('logout')
  @UseGuards(StudentJwtAuthGuard)
  async logoutStudent(@Request() req: StudentAuthRequest): Promise<void> {
    const command = new ExpireStudentRefreshTokenCommand(req.user.id);

    await this.handler.handle(command);
  }
}
