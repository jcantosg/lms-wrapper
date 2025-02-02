import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { GenerateRecoveryPasswordTokenHandler } from '#/student-360/student/application/generate-recovery-password-token/generate-recovery-password-token.handler';
import { GenerateRecoveryPasswordTokenCommand } from '#/student-360/student/application/generate-recovery-password-token/generate-recovery-password-token.command';
import { generateRecoveryPasswordTokenSchema } from '#/student-360/student/infrastructure/config/validation-schema/generate-recovery-password-token.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';

interface CreateRecoveryPasswordTokenBody {
  email: string;
}

@Controller('student-360')
export class GenerateRecoveryPasswordTokenController {
  constructor(private readonly handler: GenerateRecoveryPasswordTokenHandler) {}

  @Post('recover-password')
  @UsePipes(
    new JoiRequestBodyValidationPipe(generateRecoveryPasswordTokenSchema),
  )
  async generateRecoveryPasswordToken(
    @Body() body: CreateRecoveryPasswordTokenBody,
  ) {
    const command = new GenerateRecoveryPasswordTokenCommand(body.email);
    await this.handler.handle(command);
  }
}
