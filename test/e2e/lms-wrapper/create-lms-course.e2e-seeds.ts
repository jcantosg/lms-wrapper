import { E2eSeed } from '#test/e2e/e2e-seed';
import { v4 as uuid } from 'uuid';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { DataSource } from 'typeorm';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class CreateLmsCourseE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-create-lms-course@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = uuid();
  public static adminUserEmail = 'create-lms-course@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = uuid();
  superAdminUser: AdminUser;
  adminUser: AdminUser;

  constructor(private readonly datasource: DataSource) {}

  async arrange() {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      CreateLmsCourseE2eSeed.superAdminUserId,
      CreateLmsCourseE2eSeed.superAdminUserEmail,
      CreateLmsCourseE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );
    this.adminUser = await createAdminUser(
      this.datasource,
      CreateLmsCourseE2eSeed.adminUserId,
      CreateLmsCourseE2eSeed.adminUserEmail,
      CreateLmsCourseE2eSeed.adminUserPassword,
      [AdminUserRoles.JEFATURA],
    );
  }

  async clear() {
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
