import { UpdatePasswordCommand } from '#admin-user/application/update-password/update-password.command';
import { UpdatePasswordHandler } from '#admin-user/application/update-password/update-password.handler';
import { updatePasswordSchema } from '#admin-user/infrastructure/config/validation-schema/update-password.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { Body, Controller, Put, UsePipes } from '@nestjs/common';

interface UpdatePasswordBody {
  newPassword: string;
  token: string;
}

@Controller('update-password')
export class UpdatePasswordController {
  constructor(private readonly updatePasswordHandler: UpdatePasswordHandler) {}

  @Put()
  @UsePipes(new JoiRequestBodyValidationPipe(updatePasswordSchema))
  async generateToken(@Body() body: UpdatePasswordBody) {
    await this.updatePasswordHandler.handle(
      new UpdatePasswordCommand(body.newPassword, body.token),
    );
  }
}
