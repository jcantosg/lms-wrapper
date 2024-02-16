import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { SearchAdminUsersQuery } from '#admin-user/application/search-admin-users/search-admin-users.query';
import { SearchAdminUsersCriteria } from '#admin-user/application/search-admin-users/search-admin-users.criteria';
import {
  AdminUserRoles,
  rolePermissionsMap,
} from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class SearchAdminUsersHandler implements QueryHandler {
  constructor(private readonly adminUserRepository: AdminUserRepository) {}

  async handle(
    query: SearchAdminUsersQuery,
  ): Promise<CollectionHandlerResponse<AdminUser>> {
    const criteria = new SearchAdminUsersCriteria(query);

    const allowedRoles: AdminUserRoles[] = [];
    for (const role of query.adminUserRoles) {
      const checkedRoles = rolePermissionsMap.get(role);
      if (checkedRoles) {
        allowedRoles.push(...checkedRoles);
      }
    }

    const total = await this.adminUserRepository.count(
      criteria,
      query.adminUserBusinessUnits,
    );
    const adminUsers = await this.adminUserRepository.matching(
      criteria,
      query.adminUserBusinessUnits,
    );

    return {
      total,
      items: adminUsers.filter((adminUser) =>
        adminUser.roles.some((role) => allowedRoles.includes(role)),
      ),
    };
  }
}
