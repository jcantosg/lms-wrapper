import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { Query } from '#shared/domain/bus/query';

export class GetAdminUserDetailQuery implements Query {
  constructor(
    public readonly id: string,
    public readonly adminUserBusinessUnits: string[],
    public readonly adminUserRoles: AdminUserRoles[],
  ) {}
}
