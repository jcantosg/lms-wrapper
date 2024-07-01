import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { JoiRequestBodyValidationPipe } from '#shared/infrastructure/pipe/joi-request-body-validation-pipe.service';
import { EdaeUserAccessTokenRefresher } from '#/teacher/infrastructure/service/edae-user-access-token-refresher.service';
import { refreshTokenEdaeUserSchema } from '#/teacher/infrastructure/config/validation-schema/refresh-token-edae-user.schema';

interface RefreshTokenEdaeUserBody {
  refreshToken: string;
}

@Controller('edae-360')
export class RefreshTokenEdaeUserController {
  constructor(
    private readonly accessTokenRefresher: EdaeUserAccessTokenRefresher,
  ) {}

  @Post('auth/refresh')
  @UsePipes(new JoiRequestBodyValidationPipe(refreshTokenEdaeUserSchema))
  async refreshToken(@Body() body: RefreshTokenEdaeUserBody) {
    return await this.accessTokenRefresher.refresh(body.refreshToken);
  }
}
