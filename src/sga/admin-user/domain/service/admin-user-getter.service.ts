import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUserNotFoundException } from '#shared/domain/exception/admin-user/admin-user-not-found.exception';

export class AdminUserGetter {
  constructor(private readonly adminUserRepository: AdminUserRepository) {}

  async get(id: string): Promise<AdminUser> {
    const adminUser = await this.adminUserRepository.get(id);

    if (!adminUser) {
      throw new AdminUserNotFoundException();
    }

    return adminUser;
  }

  async getByEmail(email: string): Promise<AdminUser> {
    const adminUser = await this.adminUserRepository.getByEmail(email);

    if (!adminUser) {
      throw new AdminUserNotFoundException();
    }

    return adminUser;
  }

  async getByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
  ): Promise<AdminUser> {
    const adminUser = await this.adminUserRepository.getByAdminUser(
      id,
      adminUserBusinessUnits,
    );

    if (!adminUser) {
      throw new AdminUserNotFoundException();
    }

    return adminUser;
  }
}
