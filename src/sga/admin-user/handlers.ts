import { CreateRefreshTokenHandler } from '#admin-user/application/create-refresh-token/create-refresh-token.handler';
import { RegisterAdminUserHandler } from '#admin-user/application/register-admin-user/register-admin-user.handler';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { RefreshTokenRepository } from '#admin-user/domain/repository/refresh-token.repository';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';

const registerUserHandler = {
  provide: RegisterAdminUserHandler,
  useFactory: (
    adminUserRepository: AdminUserRepository,
    passwordEncoder: PasswordEncoder,
  ) => {
    return new RegisterAdminUserHandler(adminUserRepository, passwordEncoder);
  },
  inject: [AdminUserRepository, PasswordEncoder],
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

export const handlers = [registerUserHandler, createRefreshTokenHandler];
