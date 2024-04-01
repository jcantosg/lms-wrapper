import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { SearchAcademicProgramsQuery } from '#academic-offering/applicaton/search-academic-programs/search-academic-programs.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';

export class SearchAcademicProgramsCriteria extends Criteria {
  constructor(query: SearchAcademicProgramsQuery) {
    super(
      SearchAcademicProgramsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: SearchAcademicProgramsQuery): Filter[] {
    return [
      new Filter('name', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter(
        'name',
        query.text,
        FilterOperators.LIKE,
        GroupOperator.OR,
        'title',
      ),
      new Filter('code', query.text, FilterOperators.LIKE, GroupOperator.OR),
    ];
  }
}
