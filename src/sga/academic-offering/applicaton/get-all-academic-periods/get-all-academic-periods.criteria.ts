import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetAllAcademicPeriodsQuery } from '#academic-offering/applicaton/get-all-academic-periods/get-all-academic-periods.query';

export class GetAllAcademicPeriodsCriteria extends Criteria {
  constructor(query: GetAllAcademicPeriodsQuery) {
    super(
      GetAllAcademicPeriodsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: GetAllAcademicPeriodsQuery): Filter[] {
    return [
      new Filter('name', query.name, FilterOperators.LIKE, GroupOperator.AND),
      new Filter('code', query.code, FilterOperators.LIKE, GroupOperator.AND),
      new Filter(
        'startDate',
        query.startDate,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
      new Filter(
        'endDate',
        query.endDate,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
      new Filter(
        'name',
        query.businesUnit,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'business_unit',
      ),
    ].filter((filter) => filter.value !== undefined);
  }
}
