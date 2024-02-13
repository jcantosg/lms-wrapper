import { QueryHandler } from '#shared/domain/bus/query.handler';
import { AdminUserGetter } from '#admin-user/domain/service/admin-user-getter.service';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { GetAdminUserDetailQuery } from '#admin-user/application/get-admin-user-detail/get-admin-user-detail.query';
import { AdminUserRolesChecker } from '#admin-user/domain/service/admin-user-roles-checker.service';

export class GetAdminUserDetailHandler implements QueryHandler {
  constructor(
    private readonly adminUserGetterService: AdminUserGetter,
    private readonly adminUserRolesChecker: AdminUserRolesChecker,
  ) {}

  async handle(query: GetAdminUserDetailQuery): Promise<AdminUser> {
    const user = await this.adminUserGetterService.getByAdminUser(
      query.id,
      query.adminUserBusinessUnits,
    );

    this.adminUserRolesChecker.checkRoles(query.adminUserRoles, user.roles);

    return user;
  }
}
