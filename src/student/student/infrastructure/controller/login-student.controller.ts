import { Controller, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { Authenticator } from '#/student/student/infrastructure/service/student-authenticator.service';
import { LocalAuthGuard } from '#/student/student/infrastructure/auth/local-auth.guard';
import { StudentAuthRequest } from '#shared/infrastructure/http/request';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { loginStudentSchema } from '#/student/student/infrastructure/config/validation-schema/login-student.schema';

@Controller('student')
export class LoginStudentController {
  constructor(private readonly authenticator: Authenticator) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UsePipes(new JoiRequestBodyValidationPipe(loginStudentSchema))
  async login(@Req() req: StudentAuthRequest) {
    return await this.authenticator.login(req.user);
  }
}
