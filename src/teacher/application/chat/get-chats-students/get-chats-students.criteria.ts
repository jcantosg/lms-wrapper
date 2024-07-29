import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { GetChatsStudentsQuery } from '#/teacher/application/chat/get-chats-students/get-chats-students.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';

export class GetChatsStudentsCriteria extends Criteria {
  constructor(query: GetChatsStudentsQuery) {
    super(GetChatsStudentsCriteria.createFilters(query));
  }

  private static createFilters(query: GetChatsStudentsQuery): Filter[] {
    return [
      new Filter(
        'id',
        query.edaeUser.id,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'teacher',
      ),
      new Filter(
        'id',
        query.businessUnitId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'chatroom_businessUnit',
      ),
      new Filter(
        'id',
        query.academicPeriodId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'chatroom_academicPeriod',
      ),
      new Filter(
        'id',
        query.titleId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'chatroom_title',
      ),
      new Filter(
        'id',
        query.subjectId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'chatroom_subject',
      ),
    ].filter((filter: Filter) => filter.value !== undefined);
  }
}
