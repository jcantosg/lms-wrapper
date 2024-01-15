import { E2eSeed } from '#test/e2e/e2e-seed';
import { DataSource, Repository } from 'typeorm';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';
import { RefreshToken } from '#admin-user/domain/entity/refresh-token.entity';
import { refreshTokenSchema } from '#admin-user/infrastructure/config/schema/refresh-token.schema';

export class LogoutE2eSeed implements E2eSeed {
  public static id = '35637f98-af93-456d-bde4-811ec48d4815';
  public static email = 'get-admin-user@email.com';
  public static password = 'pass123';
  public static role = AdminUserRoles.SUPERADMIN;

  private adminUser: AdminUser;

  private readonly codeRepository: Repository<RefreshToken>;

  constructor(private readonly datasource: DataSource) {
    this.codeRepository = datasource.getRepository(refreshTokenSchema);
  }

  async arrange(): Promise<void> {
    this.adminUser = await createAdminUser(
      this.datasource,
      LogoutE2eSeed.id,
      LogoutE2eSeed.email,
      LogoutE2eSeed.password,
      [LogoutE2eSeed.role],
    );
  }

  async clear() {
    await this.codeRepository.delete({ user: { id: this.adminUser.id } });
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
