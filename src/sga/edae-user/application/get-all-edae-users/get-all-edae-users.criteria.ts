import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { GetAllEdaeUsersQuery } from '#edae-user/application/get-all-edae-users/get-all-edae-users.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';

export class GetAllEdaeUsersCriteria extends Criteria {
  constructor(query: GetAllEdaeUsersQuery) {
    super(
      GetAllEdaeUsersCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: GetAllEdaeUsersQuery): Filter[] {
    return [
      new Filter('name', query.name, FilterOperators.LIKE, GroupOperator.AND),
      new Filter(
        'surname1',
        query.surname1,
        FilterOperators.LIKE,
        GroupOperator.AND,
      ),
      new Filter(
        'surname2',
        query.surname2,
        FilterOperators.LIKE,
        GroupOperator.AND,
      ),
      new Filter('email', query.email, FilterOperators.LIKE, GroupOperator.AND),
      new Filter('roles', query.role, FilterOperators.ANY, GroupOperator.AND),
      new Filter(
        'id',
        query.location,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'country',
      ),
      new Filter(
        'name',
        query.businessUnit,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'business_units',
      ),
    ].filter((filter: Filter) => filter.value !== undefined);
  }
}
