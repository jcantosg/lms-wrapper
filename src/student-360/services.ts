import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { ConfigService } from '@nestjs/config';
import { Authenticator } from '#student-360/student/infrastructure/service/student-authenticator.service';
import { StudentCredentialsChecker } from '#student-360/student/infrastructure/service/student-credentials-checker.service';
import { RefreshTokenGenerator } from '#student-360/student/infrastructure/service/refresh-token-generator.service';
import { StudentAccessTokenRefresher } from '#student-360/student/infrastructure/service/student-access-token-refresher.service';
import { StudentRecoveryPasswordTokenGetter } from '#student-360/student/domain/service/student-recovery-password-token-getter.service';
import { StudentRecoveryPasswordTokenRepository } from '#student-360/student/domain/repository/student-recovery-password-token.repository';
import { ChatRepository } from '#shared/domain/repository/chat-repository';

const authenticator = {
  provide: Authenticator,
  useFactory: (
    jwtTokenGenerator: JwtTokenGenerator,
    refreshTokenGenerator: RefreshTokenGenerator,
    configService: ConfigService,
    chatRepository: ChatRepository,
  ) => {
    const refreshTokenTTL = configService.get<number>('REFRESH_TOKEN_TTL')!;

    return new Authenticator(
      jwtTokenGenerator,
      refreshTokenGenerator,
      refreshTokenTTL,
      chatRepository,
    );
  },
  inject: [
    JwtTokenGenerator,
    RefreshTokenGenerator,
    ConfigService,
    ChatRepository,
  ],
};

const studentRecoveryPasswordTokenGetter = {
  provide: StudentRecoveryPasswordTokenGetter,
  useFactory: (
    repository: StudentRecoveryPasswordTokenRepository,
  ): StudentRecoveryPasswordTokenGetter =>
    new StudentRecoveryPasswordTokenGetter(repository),
  inject: [StudentRecoveryPasswordTokenRepository],
};
export const services = [
  authenticator,
  StudentCredentialsChecker,
  RefreshTokenGenerator,
  JwtTokenGenerator,
  StudentAccessTokenRefresher,
  studentRecoveryPasswordTokenGetter,
];
