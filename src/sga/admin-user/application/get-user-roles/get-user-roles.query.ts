import { Query } from '#shared/domain/bus/query';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

export class GetUserRolesQuery implements Query {
  constructor(public readonly roles: AdminUserRoles[]) {}
}
