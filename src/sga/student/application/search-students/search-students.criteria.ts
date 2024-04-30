import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { SearchStudentsQuery } from '#student/application/search-students/search-students.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';

export class SearchStudentsCriteria extends Criteria {
  constructor(query: SearchStudentsQuery) {
    super(
      SearchStudentsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  static createFilters(query: SearchStudentsQuery): Filter[] {
    return [
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
