import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import {
  AdminUserResponse,
  SearchAdminUserResponse,
} from '#admin-user/infrastructure/controller/search-admin-users/search-admin-user.response';

export class SearchAdminUsersResponse {
  static create(
    adminUsers: AdminUser[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<AdminUserResponse> {
    return {
      items: adminUsers.map((adminUser) =>
        SearchAdminUserResponse.create(adminUser),
      ),
      pagination: {
        page,
        limit,
        total,
      },
    };
  }
}
