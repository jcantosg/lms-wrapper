import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetInternalGroupsQuery } from '#academic-offering/applicaton/academic-period/get-internal-groups/get-internal-groups.query';

export class GetInternalGroupsCriteria extends Criteria {
  constructor(query: GetInternalGroupsQuery) {
    super(
      GetInternalGroupsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: GetInternalGroupsQuery): Filter[] {
    return [
      new Filter('code', query.code, FilterOperators.LIKE, GroupOperator.AND),
      new Filter(
        'startDate',
        query.startDate,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'period-block',
      ),
      new Filter(
        'id',
        query.businessUnit,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'business_unit',
      ),
      new Filter(
        'id',
        query.academicPeriodId,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'academic_period',
      ),
      new Filter(
        'id',
        query.academicProgram,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'academic_program',
      ),
      new Filter(
        'id',
        query.subject,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'subject',
      ),
    ].filter((filter: Filter) => filter.value !== undefined);
  }
}
