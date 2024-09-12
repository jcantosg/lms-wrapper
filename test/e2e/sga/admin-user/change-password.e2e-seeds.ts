import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { DataSource } from 'typeorm';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';

export class ChangePasswordE2eSeed implements E2eSeed {
  public static adminUserId = 'da128406-ec85-401d-9e38-ac5d9c02b36b';
  public static adminUserEmail = 'edit-jefatura@universae.com';
  public static adminUserPassword = 'ThePass&123';
  public static adminUserRoles = [AdminUserRoles.SECRETARIA];

  public static invalidCurrentPassword = 'TheOldPass.123';
  public static newPassword = 'TheNewPass.123';
  public static invalidNewPassword = 'pass';

  private adminUser: AdminUser;

  constructor(private readonly datasource: DataSource) {}

  async arrange() {
    this.adminUser = await createAdminUser(
      this.datasource,
      ChangePasswordE2eSeed.adminUserId,
      ChangePasswordE2eSeed.adminUserEmail,
      ChangePasswordE2eSeed.adminUserPassword,
      ChangePasswordE2eSeed.adminUserRoles,
      [],
      'Samuel',
      'Gonzalez',
    );
  }

  async clear() {
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
