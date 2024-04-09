import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { SearchSubjectsQuery } from '#academic-offering/applicaton/subject/search-subjects/search-subjects.query';

export class SearchSubjectsCriteria extends Criteria {
  constructor(query: SearchSubjectsQuery) {
    super(
      SearchSubjectsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: SearchSubjectsQuery): Filter[] {
    return [
      new Filter('name', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter('code', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter(
        'officialCode',
        query.text,
        FilterOperators.LIKE,
        GroupOperator.OR,
      ),
    ].filter((filter) => filter.value !== undefined);
  }
}
