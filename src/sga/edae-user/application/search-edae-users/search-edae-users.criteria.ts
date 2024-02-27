import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { SearchEdaeUsersQuery } from '#edae-user/application/search-edae-users/search-edae-users.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';

export class SearchEdaeUsersCriteria extends Criteria {
  constructor(query: SearchEdaeUsersQuery) {
    super(
      SearchEdaeUsersCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: SearchEdaeUsersQuery): Filter[] {
    return [
      new Filter('name', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter(
        'surname1',
        query.text,
        FilterOperators.LIKE,
        GroupOperator.OR,
      ),
      new Filter(
        'surname2',
        query.text,
        FilterOperators.LIKE,
        GroupOperator.OR,
      ),
      new Filter(
        'name',
        query.text,
        FilterOperators.LIKE,
        GroupOperator.OR,
        'business_units',
      ),
    ];
  }
}
