import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';

export class GenerateRecoveryPasswordTokenE2eSeed implements E2eSeed {
  public static userId = 'd671caa8-eccb-423e-aa1d-cf044fa3c1c7';
  public static userEmail = 'superadmin@email.com';
  public static userPassword = 'pass123';
  public static userRole = AdminUserRoles.SUPERADMIN;

  private superAdminUser: AdminUser;

  constructor(private readonly datasource: DataSource) {}

  async arrange(): Promise<void> {
    this.superAdminUser = await createAdminUser(
      this.datasource,
      GenerateRecoveryPasswordTokenE2eSeed.userId,
      GenerateRecoveryPasswordTokenE2eSeed.userEmail,
      GenerateRecoveryPasswordTokenE2eSeed.userPassword,
      [GenerateRecoveryPasswordTokenE2eSeed.userRole],
    );
  }

  async clear() {
    await removeAdminUser(this.datasource, this.superAdminUser);
  }
}
