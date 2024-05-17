import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { SearchAdministrativeGroupsQuery } from '#student/application/administrative-group/search-administrative-groups/search-administrative-groups.query';

export class SearchAdministrativeGroupsCriteria extends Criteria {
  constructor(query: SearchAdministrativeGroupsQuery) {
    super(
      SearchAdministrativeGroupsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  static createFilters(query: SearchAdministrativeGroupsQuery): Filter[] {
    return [
      new Filter('code', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter(
        'name',
        query.text,
        FilterOperators.LIKE,
        GroupOperator.OR,
        'academic_program',
      ),
      new Filter(
        'name',
        query.text,
        FilterOperators.LIKE,
        GroupOperator.OR,
        'academic_period',
      ),
    ];
  }
}
