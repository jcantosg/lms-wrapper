import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { SearchAcademicProgramsByTitleQuery } from '#academic-offering/applicaton/search-academic-programs-by-title/search-academic-programs-by-title.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';

export class SearchAcademicProgramsByTitleCriteria extends Criteria {
  constructor(query: SearchAcademicProgramsByTitleQuery) {
    super(
      SearchAcademicProgramsByTitleCriteria.createFilter(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilter(
    query: SearchAcademicProgramsByTitleQuery,
  ): Filter[] {
    return [
      new Filter(
        'id',
        query.titleId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'title',
      ),
      new Filter('name', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter('code', query.text, FilterOperators.LIKE, GroupOperator.OR),
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
