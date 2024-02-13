import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class DeleteAdminUserE2eSeed implements E2eSeed {
  public static superAdminUserEmail = 'super-delete-admin-user@email.com';
  public static superAdminUserPassword = 'pass123';
  public static superAdminUserId = 'eb542dfe-0b4c-464d-8d7c-82c3a75612ff';
  public static adminUserEmail = 'delete-admin-user@email.com';
  public static adminUserPassword = 'pass123';
  public static adminUserId = '089585c3-3cc9-4d85-9e27-b733cf4100b2';

  private adminUser: AdminUser;
  private superAdminUser: AdminUser;

  constructor(private readonly datasource: DataSource) {}

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      DeleteAdminUserE2eSeed.adminUserId,
      DeleteAdminUserE2eSeed.adminUserEmail,
      DeleteAdminUserE2eSeed.adminUserPassword,
      [],
    );
    this.superAdminUser = await createAdminUser(
      this.datasource,
      DeleteAdminUserE2eSeed.superAdminUserId,
      DeleteAdminUserE2eSeed.superAdminUserEmail,
      DeleteAdminUserE2eSeed.superAdminUserPassword,
      [AdminUserRoles.SUPERADMIN],
    );
  }

  async clear(): Promise<void> {
    await removeAdminUser(this.datasource, this.superAdminUser);
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
