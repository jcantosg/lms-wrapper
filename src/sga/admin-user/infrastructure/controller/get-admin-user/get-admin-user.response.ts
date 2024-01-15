import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetAdminUserResponse {
  static create(adminUser: AdminUser) {
    return {
      id: adminUser.id,
      name: adminUser.name,
      roles: adminUser.roles,
      businessUnits: [],
      avatar: adminUser.avatar,
    };
  }
}
