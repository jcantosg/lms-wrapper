import { AdminUserRolesChecker } from './admin-user-roles-checker.service';
import {
  AdminUserRoles,
  getAdminUserRoles,
} from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdminUserNotAllowedRolesException } from '#shared/domain/exception/admin-user/admin-user-not-allowed-roles.exception';

describe('AdminUserRolesCheckerService', () => {
  let service: AdminUserRolesChecker;

  beforeAll(async () => {
    service = new AdminUserRolesChecker();
  });

  it('should not throw any error', () => {
    expect(() =>
      service.checkRoles(
        [AdminUserRoles.SUPERADMIN],
        getAdminUserRoles([AdminUserRoles.SUPERADMIN]),
      ),
    ).not.toThrow(AdminUserNotAllowedRolesException);
  });
  it('should throw an error', () => {
    expect(() => {
      service.checkRoles(
        [AdminUserRoles.JEFATURA],
        getAdminUserRoles([AdminUserRoles.SUPERVISOR_360]),
      );
    }).toThrow(AdminUserNotAllowedRolesException);
  });
});
