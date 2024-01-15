import { LoginAdminUserController } from '#admin-user/infrastructure/controller/auth/login-admin-user.controller';
import { LogoutAdminUserController } from '#admin-user/infrastructure/controller/auth/logout-admin-user.controller';
import { RefreshAdminTokenController } from '#admin-user/infrastructure/controller/auth/refresh-admin-token.controller';
import { RegisterAdminUserController } from '#admin-user/infrastructure/controller/auth/register-admin-user.controller';
import { GetAdminUserController } from '#admin-user/infrastructure/controller/get-admin-user/get-admin-user.controller';

export const controllers = [
  RegisterAdminUserController,
  LoginAdminUserController,
  RefreshAdminTokenController,
  LogoutAdminUserController,
  GetAdminUserController,
];
