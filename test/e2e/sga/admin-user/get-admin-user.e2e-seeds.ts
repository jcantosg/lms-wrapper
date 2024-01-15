import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';

export class GetAdminUserE2eSeed implements E2eSeed {
  public static id = '35637f98-af93-456d-bde4-811ec48d4815';
  public static email = 'get-admin-user@email.com';
  public static password = 'pass123';
  public static role = AdminUserRoles.SUPERADMIN;

  private adminUser: AdminUser;

  constructor(private readonly datasource: DataSource) {}

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      GetAdminUserE2eSeed.id,
      GetAdminUserE2eSeed.email,
      GetAdminUserE2eSeed.password,
      [GetAdminUserE2eSeed.role],
    );
  }

  async clear() {
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
