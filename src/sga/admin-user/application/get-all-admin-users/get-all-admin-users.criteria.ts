import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { rolePermissionsMap } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { GetAllAdminUsersQuery } from '#admin-user/application/get-all-admin-users/get-all-admin-users.query';

export class GetAllAdminUsersCriteria extends Criteria {
  constructor(query: GetAllAdminUsersQuery) {
    super(
      GetAllAdminUsersCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: GetAllAdminUsersQuery): Filter[] {
    let filterRoles;
    const allowedRoles = [];
    for (const role of query.adminUserRoles) {
      const checkedRoles = rolePermissionsMap.get(role);
      if (checkedRoles) {
        allowedRoles.push(...checkedRoles);
      }
    }
    filterRoles = allowedRoles;

    if (allowedRoles && query.role) {
      filterRoles = allowedRoles.includes(query.role) ? [query.role] : [];
    }

    return [
      new Filter('name', query.name, FilterOperators.LIKE, GroupOperator.AND),
      new Filter(
        'surname',
        query.surname,
        FilterOperators.LIKE,
        GroupOperator.AND,
      ),
      new Filter('email', query.email, FilterOperators.LIKE, GroupOperator.AND),
      new Filter(
        'name',
        query.businessUnitName,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'business_units',
      ),
      new Filter(
        'roles',
        filterRoles,
        FilterOperators.OVERLAP,
        GroupOperator.AND,
      ),
    ].filter((filter) => filter.value !== undefined);
  }
}
