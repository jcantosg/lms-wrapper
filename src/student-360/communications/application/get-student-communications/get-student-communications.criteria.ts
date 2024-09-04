import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { Order, OrderTypes } from '#/sga/shared/domain/criteria/order';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { GetStudentCommunicationsQuery } from '#student-360/communications/application/get-student-communications/get-student-communications.query';

export class GetStudentCommunicationsCriteria extends Criteria {
  constructor(query: GetStudentCommunicationsQuery) {
    super(
      GetStudentCommunicationsCriteria.createFilters(query),
      new Order('updatedAt', OrderTypes.DESC),
    );
  }

  static createFilters(query: GetStudentCommunicationsQuery): Filter[] {
    const filters = [
      new Filter(
        'id',
        query.student.id,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'student',
      ),
    ];
    if (query.subject) {
      filters.push(
        new Filter(
          'message',
          query.subject,
          FilterOperators.JSON_VALUE,
          GroupOperator.AND,
          'communication',
          'subject',
        ),
      );
    }

    return filters;
  }
}
