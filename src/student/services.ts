import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { ConfigService } from '@nestjs/config';
import { Authenticator } from '#/student/student/infrastructure/service/student-authenticator.service';
import { StudentCredentialsChecker } from '#/student/student/infrastructure/service/student-credentials-checker.service';
import { RefreshTokenGenerator } from '#/student/student/infrastructure/service/refresh-token-generator.service';

const authenticator = {
  provide: Authenticator,
  useFactory: (
    jwtTokenGenerator: JwtTokenGenerator,
    refreshTokenGenerator: RefreshTokenGenerator,
    configService: ConfigService,
  ) => {
    const refreshTokenTTL = configService.get<number>('REFRESH_TOKEN_TTL')!;

    return new Authenticator(
      jwtTokenGenerator,
      refreshTokenGenerator,
      refreshTokenTTL,
    );
  },
  inject: [JwtTokenGenerator, RefreshTokenGenerator, ConfigService],
};
export const services = [
  authenticator,
  StudentCredentialsChecker,
  RefreshTokenGenerator,
  JwtTokenGenerator,
];
