import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { StudentAccessTokenRefresher } from '#/student/student/infrastructure/service/student-access-token-refresher.service';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { refreshTokenStudentSchema } from '#/student/student/infrastructure/config/validation-schema/refresh-token-student.schema';

interface RefreshTokenStudentBody {
  refreshToken: string;
}

@Controller('student')
export class RefreshTokenStudentController {
  constructor(
    private readonly accessTokenRefresher: StudentAccessTokenRefresher,
  ) {}

  @Post('auth/refresh')
  @UsePipes(new JoiRequestBodyValidationPipe(refreshTokenStudentSchema))
  async refreshToken(@Body() body: RefreshTokenStudentBody) {
    return await this.accessTokenRefresher.refresh(body.refreshToken);
  }
}
