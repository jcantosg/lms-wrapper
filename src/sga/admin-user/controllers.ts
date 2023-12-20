import { LoginAdminUserController } from '#admin-user/infrastructure/controller/auth/login-admin-user.controller';
import { RefreshAdminTokenController } from '#admin-user/infrastructure/controller/auth/refresh-admin-token.controller';
import { RegisterAdminUserController } from '#admin-user/infrastructure/controller/auth/register-admin-user.controller';

export const controllers = [
  RegisterAdminUserController,
  LoginAdminUserController,
  RefreshAdminTokenController,
];
