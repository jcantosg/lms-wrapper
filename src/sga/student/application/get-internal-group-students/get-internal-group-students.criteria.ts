import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetInternalGroupStudentsQuery } from '#student/application/get-internal-group-students/get-internal-group-students.query';

export class GetInternalGroupStudentsCriteria extends Criteria {
  constructor(query: GetInternalGroupStudentsQuery) {
    super(
      GetInternalGroupStudentsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: GetInternalGroupStudentsQuery): Filter[] {
    return [
      new Filter(
        'id',
        query.internalGroupId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'internalGroups',
      ),
      new Filter('name', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter('surname', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter(
        'surname2',
        query.text,
        FilterOperators.LIKE,
        GroupOperator.OR,
      ),
      new Filter(
        'identityDocument',
        query.text,
        FilterOperators.JSON_VALUE,
        GroupOperator.OR,
        undefined,
        'identityDocumentNumber',
      ),
    ].filter((filter: Filter) => filter.value !== undefined);
  }
}
