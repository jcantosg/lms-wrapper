import { QueryHandler } from '#shared/domain/bus/query.handler';
import { CollectionHandlerResponse } from '#/sga/shared/application/collection.handler.response';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { GetAllAdminUsersQuery } from '#admin-user/application/get-all-admin-users/get-all-admin-users.query';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { GetAllAdminUsersCriteria } from '#admin-user/application/get-all-admin-users/get-all-admin-users.criteria';

export class GetAllAdminUsersHandler implements QueryHandler {
  constructor(private readonly adminUserRepository: AdminUserRepository) {}

  async handle(
    query: GetAllAdminUsersQuery,
  ): Promise<CollectionHandlerResponse<AdminUser>> {
    const criteria = new GetAllAdminUsersCriteria(query);

    const [total, adminUsers] = await Promise.all([
      this.adminUserRepository.count(criteria, query.adminUserBusinessUnits),
      this.adminUserRepository.matching(criteria, query.adminUserBusinessUnits),
    ]);

    return {
      total,
      items: adminUsers,
    };
  }
}
