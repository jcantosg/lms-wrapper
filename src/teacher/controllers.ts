import { LoginEdaeUserController } from '#/teacher/infrastructure/controller/login-edae-user.controller';
import { RefreshTokenEdaeUserController } from '#/teacher/infrastructure/controller/refresh-token-edae-user.controller';
import { LogoutEdaeUserController } from '#/teacher/infrastructure/controller/logout-edae-user.controller';

export const edaeUserControllers = [
  LoginEdaeUserController,
  RefreshTokenEdaeUserController,
  LogoutEdaeUserController,
];
