import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { SearchStudentsByAdministrativeGroupQuery } from '#student/application/search-students-by-administrative-group/search-students-by-administrative-group.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';

export class SearchStudentsByAdministrativeGroupCriteria extends Criteria {
  constructor(query: SearchStudentsByAdministrativeGroupQuery) {
    super(
      SearchStudentsByAdministrativeGroupCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  static createFilters(
    query: SearchStudentsByAdministrativeGroupQuery,
  ): Filter[] {
    return [
      new Filter(
        'id',
        query.administrativeGroupId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'administrativeGroups',
      ),
      new Filter('name', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter('surname', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter(
        'identityDocument',
        query.text,
        FilterOperators.JSON_VALUE,
        GroupOperator.OR,
        undefined,
        'identityDocumentNumber',
      ),
    ];
  }
}
