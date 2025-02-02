import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { SearchInternalGroupsQuery } from '#academic-offering/applicaton/academic-period/search-internal-groups/search-internal-groups.query';

export class SearchInternalGroupsCriteria extends Criteria {
  constructor(query: SearchInternalGroupsQuery) {
    super(
      SearchInternalGroupsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: SearchInternalGroupsQuery): Filter[] {
    return [
      new Filter('code', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter(
        'id',
        query.academicPeriodId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'academic_period',
      ),
    ].filter((filter: Filter) => filter.value !== undefined);
  }
}
