import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export interface AdminUserResponseBasic {
  id: string;
  name: string;
}

export interface AdminUserResponse {
  id: string;
  name: string;
  surname: string;
  email: string;
  businessUnits: { name: string }[];
  avatar: string;
  roles: AdminUserRoles[];
}

export class SearchAdminUserResponse {
  static create(adminUser: AdminUser) {
    return {
      id: adminUser.id,
      name: adminUser.name,
      surname: adminUser.surname,
      email: adminUser.email,
      businessUnits: adminUser.businessUnits.map((bu) => ({ name: bu.name })),
      avatar: adminUser.avatar,
      roles: adminUser.roles,
    };
  }
}
