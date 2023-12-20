import { refreshTokenSchema } from '#admin-user/infrastructure/config/validation-schema/refresh-token.schema';
import { AccessTokenRefresherService } from '#admin-user/infrastructure/service/access-token-refresher.service';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';

@Controller('auth')
export class RefreshAdminTokenController {
  constructor(
    private readonly accessTokenRefresherService: AccessTokenRefresherService,
  ) {}

  @Post('refresh')
  @UsePipes(new JoiRequestBodyValidationPipe(refreshTokenSchema))
  async refresh(@Body() body: any) {
    return this.accessTokenRefresherService.refresh(body.refreshToken);
  }
}
