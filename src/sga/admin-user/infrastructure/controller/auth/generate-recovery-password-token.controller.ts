import { GenerateRecoveryPasswordTokenCommand } from '#admin-user/application/generate-recovery-password-token/generate-recovery-password-token.command';
import { GenerateRecoveryPasswordTokenHandler } from '#admin-user/application/generate-recovery-password-token/generate-recovery-password-token.handler';
import { generateRecoveryPasswordTokenSchema } from '#admin-user/infrastructure/config/validation-schema/generate-recovery-password-token.schema';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';

interface GenerateRecoveryPasswordTokenBody {
  email: string;
}

@Controller('recover-password')
export class GenerateRecoveryPasswordTokenController {
  constructor(
    private readonly generateRecoveryPasswordTokenHandler: GenerateRecoveryPasswordTokenHandler,
  ) {}

  @Post()
  @UsePipes(
    new JoiRequestBodyValidationPipe(generateRecoveryPasswordTokenSchema),
  )
  async generateToken(@Body() body: GenerateRecoveryPasswordTokenBody) {
    await this.generateRecoveryPasswordTokenHandler.handle(
      new GenerateRecoveryPasswordTokenCommand(body.email),
    );
  }
}
