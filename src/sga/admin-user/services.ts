import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { PasswordChecker } from '#admin-user/domain/service/password-checker.service';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { AccessTokenRefresherService } from '#admin-user/infrastructure/service/access-token-refresher.service';
import { Authenticator } from '#admin-user/infrastructure/service/authenticator.service';
import { BcryptPasswordChecker } from '#admin-user/infrastructure/service/bcrypt-password-checker.service';
import { BCryptPasswordEncoder } from '#shared/infrastructure/service/bcrypt-password-encoder.service';
import { CredentialsChecker } from '#admin-user/infrastructure/service/credentials-checker.service';
import { JwtTokenGenerator } from '#shared/infrastructure/service/jwt-token-generator.service';
import { RefreshTokenGenerator } from '#admin-user/infrastructure/service/refresh-token-generator.service';
import { ConfigService } from '@nestjs/config';
import { AdminUserPasswordGenerator } from '#admin-user/domain/service/admin-user-password-generator.service';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';
import { AdminUserBusinessUnitsChecker } from '#admin-user/domain/service/admin-user-business-units.checker.service';
import { RecoveryPasswordTokenGetter } from '#admin-user/domain/service/recovery-password-token-getter.service';
import { RecoveryPasswordTokenRepository } from '#admin-user/domain/repository/recovery-password-token.repository';
import { PasswordFormatChecker } from '#admin-user/domain/service/password-format-checker.service';
import { EventDispatcher } from '#shared/domain/event/event-dispatcher.service';

const adminUserGetter = {
  provide: AdminUserGetter,
  useFactory: (adminUserRepository: AdminUserRepository) => {
    return new AdminUserGetter(adminUserRepository);
  },
  inject: [AdminUserRepository],
};

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

const passwordEncoder = {
  provide: PasswordEncoder,
  useClass: BCryptPasswordEncoder,
};

const passwordChecker = {
  provide: PasswordChecker,
  useClass: BcryptPasswordChecker,
};

const recoveryPasswordTokenGetter = {
  provide: RecoveryPasswordTokenGetter,
  useFactory: (
    recoveryPasswordTokenRepository: RecoveryPasswordTokenRepository,
  ) => {
    return new RecoveryPasswordTokenGetter(recoveryPasswordTokenRepository);
  },
  inject: [RecoveryPasswordTokenRepository],
};

const credentialsChecker = {
  provide: CredentialsChecker,
  useFactory: (
    adminUserRepository: AdminUserRepository,
    passwordChecker: PasswordChecker,
    eventDispatcher: EventDispatcher,
    recoveryPasswordTokenRepository: RecoveryPasswordTokenRepository,
    jwtTokenGenerator: JwtTokenGenerator,
    configService: ConfigService,
  ) => {
    return new CredentialsChecker(
      adminUserRepository,
      passwordChecker,
      eventDispatcher,
      recoveryPasswordTokenRepository,
      jwtTokenGenerator,
      configService.get<number>('RECOVERY_TOKEN_TTL')!,
    );
  },
  inject: [
    AdminUserRepository,
    PasswordChecker,
    EventDispatcher,
    RecoveryPasswordTokenRepository,
    JwtTokenGenerator,
    ConfigService,
  ],
};

export const services = [
  adminUserGetter,
  authenticator,
  passwordEncoder,
  JwtTokenGenerator,
  RefreshTokenGenerator,
  credentialsChecker,
  passwordChecker,
  AccessTokenRefresherService,
  AdminUserPasswordGenerator,
  AdminUserRolesChecker,
  AdminUserBusinessUnitsChecker,
  recoveryPasswordTokenGetter,
  PasswordFormatChecker,
];
