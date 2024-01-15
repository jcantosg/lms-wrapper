import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { GetAdminUserQuery } from '#admin-user/application/get-admin-user/get-admin-user.query';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetAdminUserHandler implements QueryHandler {
  constructor(private readonly adminUserGetterService: AdminUserGetter) {}

  async handle(query: GetAdminUserQuery): Promise<AdminUser> {
    return await this.adminUserGetterService.get(query.id);
  }
}
