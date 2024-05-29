import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetAllInternalGroupsQuery } from '#academic-offering/applicaton/academic-program/get-all-internal-groups/get-all-internal-groups.query';

export class GetAllInternalGroupsCriteria extends Criteria {
  constructor(query: GetAllInternalGroupsQuery) {
    super(
      GetAllInternalGroupsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: GetAllInternalGroupsQuery): Filter[] {
    return [
      new Filter(
        'id',
        query.academicProgramId,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'academic_program',
      ),
      new Filter(
        'name',
        query.academicPeriod,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'academic_period',
      ),
      new Filter(
        'name',
        query.subject,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'subject',
      ),
    ].filter((filter: Filter) => filter.value !== undefined);
  }
}
