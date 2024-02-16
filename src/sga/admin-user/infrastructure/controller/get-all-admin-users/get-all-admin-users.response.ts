import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import {
  AdminUserResponse,
  GetAllAdminUserResponse,
} from '#admin-user/infrastructure/controller/get-all-admin-users/get-admin-user.response';

export class GetAllAdminUsersResponse {
  static create(
    adminUsers: AdminUser[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<AdminUserResponse> {
    return {
      items: adminUsers.map((adminUser) =>
        GetAllAdminUserResponse.create(adminUser),
      ),
      pagination: {
        page,
        limit,
        total,
      },
    };
  }
}
