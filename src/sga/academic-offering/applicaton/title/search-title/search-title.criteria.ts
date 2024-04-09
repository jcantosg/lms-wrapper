import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { SearchTitleQuery } from '#academic-offering/applicaton/title/search-title/search-title.query';

export class SearchTitleCriteria extends Criteria {
  constructor(query: SearchTitleQuery) {
    super(
      SearchTitleCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: SearchTitleQuery): Filter[] {
    return [
      new Filter('name', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter(
        'officialTitle',
        query.text,
        FilterOperators.LIKE,
        GroupOperator.OR,
      ),
      new Filter(
        'officialProgram',
        query.text,
        FilterOperators.LIKE,
        GroupOperator.OR,
      ),
      new Filter(
        'name',
        query.text,
        FilterOperators.LIKE,
        GroupOperator.OR,
        'business_unit',
      ),
    ];
  }
}
