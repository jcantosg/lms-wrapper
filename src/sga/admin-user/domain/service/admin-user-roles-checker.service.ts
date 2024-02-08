import {
  AdminUserRoles,
  getAdminUserRoles,
} from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdminUserNotAllowedRolesException } from '#shared/domain/exception/admin-user/admin-user-not-allowed-roles.exception';

export class AdminUserRolesChecker {
  checkRoles(roles: AdminUserRoles[], rolesToCheck: AdminUserRoles[]) {
    const allowedRoles = getAdminUserRoles(roles);
    rolesToCheck.forEach((role: AdminUserRoles) => {
      if (!allowedRoles.includes(role)) {
        throw new AdminUserNotAllowedRolesException();
      }
    });
  }
}
