import { getAdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetUserRolesQuery } from '#admin-user/application/get-user-roles/get-user-roles.query';

export class GetUserRolesHandler implements QueryHandler {
  handle(query: GetUserRolesQuery): string[] {
    return getAdminUserRoles(query.roles);
  }
}
