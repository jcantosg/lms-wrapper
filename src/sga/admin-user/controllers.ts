import { LoginAdminUserController } from '#admin-user/infrastructure/controller/auth/login-admin-user.controller';
import { LogoutAdminUserController } from '#admin-user/infrastructure/controller/auth/logout-admin-user.controller';
import { RefreshAdminTokenController } from '#admin-user/infrastructure/controller/auth/refresh-admin-token.controller';
import { RegisterAdminUserController } from '#admin-user/infrastructure/controller/auth/register-admin-user.controller';
import { GetAdminUserController } from '#admin-user/infrastructure/controller/get-admin-user/get-admin-user.controller';
import { SearchAdminUsersController } from '#admin-user/infrastructure/controller/search-admin-users/search-admin-users.controller';
import { GetAllAdminUsersController } from '#admin-user/infrastructure/controller/get-all-admin-users/get-all-admin-users.controller';
import { GetAdminUserDetailController } from './infrastructure/controller/get-admin-user-detail/get-admin-user-detail.controller';
import { GetIdentityDocumentTypesController } from './infrastructure/controller/get-identity-document-types/get-identity-document-types.controller';
import { GetRolesController } from './infrastructure/controller/get-user-roles/get-user-roles.controller';
import { DeleteAdminUserController } from '#admin-user/infrastructure/controller/delete-admin-user/delete-admin-user.controller';
import { EditAdminUserController } from '#admin-user/infrastructure/controller/edit-admin-user/edit-admin-user.controller';
import { AddBusinessUnitsToAdminUserController } from '#admin-user/infrastructure/controller/add-business-units-to-admin-user/add-business-units-to-admin-user.controller';
import { RemoveBusinessUnitFromAdminUserController } from '#admin-user/infrastructure/controller/remove-business-unit-from-admin-user/remove-business-unit-from-admin-user.controller';
import { GenerateRecoveryPasswordTokenController } from '#admin-user/infrastructure/controller/auth/generate-recovery-password-token.controller';
import { UpdatePasswordController } from '#admin-user/infrastructure/controller/auth/update-password.controller';

export const controllers = [
  RegisterAdminUserController,
  LoginAdminUserController,
  RefreshAdminTokenController,
  LogoutAdminUserController,
  GetAdminUserController,
  GetIdentityDocumentTypesController,
  GetRolesController,
  SearchAdminUsersController,
  GetAllAdminUsersController,
  DeleteAdminUserController,
  GetAdminUserDetailController,
  EditAdminUserController,
  AddBusinessUnitsToAdminUserController,
  RemoveBusinessUnitFromAdminUserController,
  GenerateRecoveryPasswordTokenController,
  UpdatePasswordController,
];
