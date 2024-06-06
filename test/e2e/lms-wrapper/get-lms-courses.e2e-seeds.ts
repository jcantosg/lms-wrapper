import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { DataSource } from 'typeorm';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetLmsCoursesE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-get-lms-courses@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'get-lms-courses@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();
  superAdminUser: AdminUser;
  adminUser: AdminUser;

  constructor(private readonly datasource: DataSource) {}

  async arrange() {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GetLmsCoursesE2eSeed.superAdminUserId,
      GetLmsCoursesE2eSeed.superAdminUserEmail,
      GetLmsCoursesE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      GetLmsCoursesE2eSeed.adminUserId,
      GetLmsCoursesE2eSeed.adminUserEmail,
      GetLmsCoursesE2eSeed.adminUserPassword,
      [AdminUserRoles.JEFATURA],
    );
  }

  async clear() {
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
