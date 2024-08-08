import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetAllAdministrativeProcessesQuery } from '#student/application/administrative-process/get-all-administrative-processes/get-all-administrative-processes.query';

export class GetAllAdministrativeProcessesCriteria extends Criteria {
  constructor(query: GetAllAdministrativeProcessesQuery) {
    super(
      GetAllAdministrativeProcessesCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  static createFilters(query: GetAllAdministrativeProcessesQuery): Filter[] {
    return [
      new Filter(
        'name',
        query.name,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'student',
      ),
      new Filter(
        'id',
        query.businessUnit,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'business_unit',
      ),
      new Filter(
        'createdAt',
        query.createdAt,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
      new Filter(
        'updatedAt',
        query.updatedAt,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
      new Filter('type', query.type, FilterOperators.EQUALS, GroupOperator.AND),
      new Filter(
        'status',
        query.status,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
    ].filter((filter) => filter.value !== undefined);
  }
}
