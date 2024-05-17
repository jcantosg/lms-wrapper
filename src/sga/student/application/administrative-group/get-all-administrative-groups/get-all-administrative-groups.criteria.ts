import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetAllAdministrativeGroupsQuery } from '#student/application/administrative-group/get-all-administrative-groups/get-all-administrative-groups.query';

export class GetAllAdministrativeGroupsCriteria extends Criteria {
  constructor(query: GetAllAdministrativeGroupsQuery) {
    super(
      GetAllAdministrativeGroupsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  static createFilters(query: GetAllAdministrativeGroupsQuery): Filter[] {
    return [
      new Filter('code', query.code, FilterOperators.LIKE, GroupOperator.AND),
      new Filter(
        'id',
        query.academicProgramId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'academic_program',
      ),
      new Filter(
        'id',
        query.academicPeriodId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'academic_period',
      ),
      new Filter(
        'id',
        query.businessUnitId,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'business_unit',
      ),
      new Filter(
        'startMonth',
        query.startMonth,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'period_block',
      ),
      new Filter(
        'academicYear',
        query.academicYear,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'period_block',
      ),
      new Filter(
        'name',
        query.blockName,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'period_block',
      ),
    ].filter((filter) => filter.value !== undefined);
  }
}
