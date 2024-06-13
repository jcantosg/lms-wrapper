import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetAllStudentsByAdministrativeGroupQuery } from '#student/application/get-all-students-by-administrative-group/get-all-students-by-administrative-group.query';

export class GetAllStudentsByAdministrativeGroupCriteria extends Criteria {
  constructor(query: GetAllStudentsByAdministrativeGroupQuery) {
    super(
      GetAllStudentsByAdministrativeGroupCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  static createFilters(
    query: GetAllStudentsByAdministrativeGroupQuery,
  ): Filter[] {
    return [
      new Filter(
        'id',
        query.administrativeGroupId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'administrativeGroups',
      ),
    ];
  }
}
