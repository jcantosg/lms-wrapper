import { Criteria, GroupOperator } from '#/sga/shared/domain/criteria/criteria';
import { Filter, FilterOperators } from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { rolePermissionsMap } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { SearchAdminUsersQuery } from '#admin-user/application/search-admin-users/search-admin-users.query';

export class SearchAdminUsersCriteria extends Criteria {
  constructor(query: SearchAdminUsersQuery) {
    super(
      SearchAdminUsersCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      GroupOperator.OR,
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: SearchAdminUsersQuery): Filter[] {
    const allowedRoles = [];
    for (const role of query.adminUserRoles) {
      const checkedRoles = rolePermissionsMap.get(role);
      if (checkedRoles) {
        allowedRoles.push(...checkedRoles);
      }
    }

    return [
      new Filter('name', query.text, FilterOperators.LIKE),
      new Filter('surname', query.text, FilterOperators.LIKE),
      new Filter('email', query.text, FilterOperators.LIKE),
      new Filter('name', query.text, FilterOperators.LIKE, 'business_units'),
      new Filter('roles', allowedRoles, FilterOperators.OVERLAP),
    ].filter((filter) => filter.value !== undefined);
  }
}
