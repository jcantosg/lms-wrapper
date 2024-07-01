import { ConfigService } from '@nestjs/config';
import { EdaeUserPasswordChecker } from '#/teacher/domain/service/edae-user-password-checker.service';
import { BcryptEdaeUserPasswordChecker } from '#/teacher/infrastructure/service/bcrypt-edae-user-password-checker.service';
import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { Authenticator } from '#/teacher/infrastructure/service/edae-user-authenticator.service';
import { EdaeUserCredentialsChecker } from '#/teacher/infrastructure/service/edae-user-credentials-checker.service';
import { EdaeUserRefreshTokenGenerator } from '#/teacher/infrastructure/service/edae-user-refresh-token-generator.service';
import { EdaeUserAccessTokenRefresher } from '#/teacher/infrastructure/service/edae-user-access-token-refresher.service';

const passwordChecker = {
  provide: EdaeUserPasswordChecker,
  useClass: BcryptEdaeUserPasswordChecker,
};

const authenticator = {
  provide: Authenticator,
  useFactory: (
    jwtTokenGenerator: JwtTokenGenerator,
    refreshTokenGenerator: EdaeUserRefreshTokenGenerator,
    configService: ConfigService,
  ) => {
    const refreshTokenTTL = configService.get<number>('REFRESH_TOKEN_TTL')!;

    return new Authenticator(
      jwtTokenGenerator,
      refreshTokenGenerator,
      refreshTokenTTL,
    );
  },
  inject: [JwtTokenGenerator, EdaeUserRefreshTokenGenerator, ConfigService],
};

export const services = [
  authenticator,
  EdaeUserCredentialsChecker,
  EdaeUserRefreshTokenGenerator,
  JwtTokenGenerator,
  passwordChecker,
  EdaeUserAccessTokenRefresher,
];
