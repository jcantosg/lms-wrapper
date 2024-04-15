import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { SearchAcademicProgramsByAcademicPeriodQuery } from '#academic-offering/applicaton/search-academic-program-by-period/search-academic-program-by-period.query';

export class SearchAcademicProgramByAcademicPeriodCriteria extends Criteria {
  constructor(query: SearchAcademicProgramsByAcademicPeriodQuery) {
    super(
      SearchAcademicProgramByAcademicPeriodCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(
    query: SearchAcademicProgramsByAcademicPeriodQuery,
  ): Filter[] {
    return [
      new Filter(
        'id',
        query.academicPeriodId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'academicPeriods',
      ),
      new Filter('name', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter('code', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter(
        'officialCode',
        query.text,
        FilterOperators.LIKE,
        GroupOperator.OR,
        'title',
      ),
    ];
  }
}
