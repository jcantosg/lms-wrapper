import { Body, Controller, Put, UsePipes } from '@nestjs/common';
import { UpdateStudentPasswordHandler } from '#/student/student/application/update-password/update-password.handler';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { studentUpdatePasswordSchema } from '#/student/student/infrastructure/config/validation-schema/update-student-password.schema';
import { UpdateStudentPasswordCommand } from '#/student/student/application/update-password/update-password.command';

interface UpdateStudentPasswordBody {
  newPassword: string;
  token: string;
}

@Controller('student')
export class UpdateStudentPasswordController {
  constructor(private readonly handler: UpdateStudentPasswordHandler) {}

  @Put('auth/update-password')
  @UsePipes(new JoiRequestBodyValidationPipe(studentUpdatePasswordSchema))
  async updateStudentPassword(@Body() body: UpdateStudentPasswordBody) {
    const command = new UpdateStudentPasswordCommand(
      body.newPassword,
      body.token,
    );

    await this.handler.handle(command);
  }
}
