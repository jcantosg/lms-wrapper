import { CreateRefreshTokenHandler } from '#admin-user/application/create-refresh-token/create-refresh-token.handler';
import { ExpireRefreshTokenHandler } from '#admin-user/application/expire-refresh-token/expire-refresh-token.handler';
import { GetAdminUserHandler } from '#admin-user/application/get-admin-user/get-admin-user.handler';
import { RegisterAdminUserHandler } from '#admin-user/application/register-admin-user/register-admin-user.handler';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { RefreshTokenRepository } from '#admin-user/domain/repository/refresh-token.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';
import { ConfigService } from '@nestjs/config';

const getAdminUserHandler = {
  provide: GetAdminUserHandler,
  useFactory: (adminUserGetter: AdminUserGetter) => {
    return new GetAdminUserHandler(adminUserGetter);
  },
  inject: [AdminUserGetter],
};

const registerUserHandler = {
  provide: RegisterAdminUserHandler,
  useFactory: (
    adminUserRepository: AdminUserRepository,
    passwordEncoder: PasswordEncoder,
    configService: ConfigService,
  ) => {
    return new RegisterAdminUserHandler(
      adminUserRepository,
      passwordEncoder,
      configService.getOrThrow<string>('DEFAULT_AVATAR'),
    );
  },
  inject: [AdminUserRepository, PasswordEncoder, ConfigService],
};

const createRefreshTokenHandler = {
  provide: CreateRefreshTokenHandler,
  useFactory: (
    adminUserGetter: AdminUserGetter,
    codeRepository: RefreshTokenRepository,
  ) => {
    return new CreateRefreshTokenHandler(adminUserGetter, codeRepository);
  },
  inject: [AdminUserGetter, RefreshTokenRepository],
};

const expireRefreshTokenHandler = {
  provide: ExpireRefreshTokenHandler,
  useFactory: (
    adminUserGetter: AdminUserGetter,
    codeRepository: RefreshTokenRepository,
  ) => {
    return new ExpireRefreshTokenHandler(adminUserGetter, codeRepository);
  },
  inject: [AdminUserGetter, RefreshTokenRepository],
};

export const handlers = [
  registerUserHandler,
  createRefreshTokenHandler,
  expireRefreshTokenHandler,
  getAdminUserHandler,
];
