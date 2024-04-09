import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { SearchAcademicPeriodsQuery } from '#academic-offering/applicaton/academic-period/search-academic-periods/search-academic-periods.query';

export class SearchAcademicPeriodsCriteria extends Criteria {
  constructor(query: SearchAcademicPeriodsQuery) {
    super(
      SearchAcademicPeriodsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: SearchAcademicPeriodsQuery): Filter[] {
    return [
      new Filter('name', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter('code', query.text, FilterOperators.LIKE, GroupOperator.OR),
    ].filter((filter) => filter.value !== undefined);
  }
}
