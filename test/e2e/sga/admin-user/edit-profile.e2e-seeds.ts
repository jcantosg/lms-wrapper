import { E2eSeed } from '#test/e2e/e2e-seed';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { DataSource } from 'typeorm';
import {
  createAdminUser,
  removeAdminUser,
} from '#test/e2e/sga/e2e-auth-helper';

export class EditProfileE2eSeed implements E2eSeed {
  public static adminUserId = 'da128406-ec85-401d-9e38-ac5d9c02b36b';
  public static adminUserEmail = 'edit-jefatura@universae.com';
  public static adminUserPassword = 'pass123';
  public static adminUserRoles = [AdminUserRoles.SECRETARIA];

  public static newName = 'Samuel';
  public static newSurname = 'Sanchez';
  public static newSurname2 = 'Alvarez';

  private adminUser: AdminUser;

  constructor(private readonly datasource: DataSource) {}

  async arrange() {
    this.adminUser = await createAdminUser(
      this.datasource,
      EditProfileE2eSeed.adminUserId,
      EditProfileE2eSeed.adminUserEmail,
      EditProfileE2eSeed.adminUserPassword,
      EditProfileE2eSeed.adminUserRoles,
      [],
      'Samuel',
      'Gonzalez',
    );
  }

  async clear() {
    await removeAdminUser(this.datasource, this.adminUser);
  }
}
