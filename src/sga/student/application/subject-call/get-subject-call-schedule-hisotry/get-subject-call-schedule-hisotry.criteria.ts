import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetSubjectCallScheduleHistoryQuery } from '#student/application/subject-call/get-subject-call-schedule-hisotry/get-subject-call-schedule-hisotry.query';

export class SubjectCallScheduleHistoryCriteria extends Criteria {
  constructor(query: GetSubjectCallScheduleHistoryQuery) {
    super(
      SubjectCallScheduleHistoryCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
    );
  }

  private static createFilters(
    query: GetSubjectCallScheduleHistoryQuery,
  ): Filter[] {
    return [
      new Filter(
        'createdAt',
        new Date(`${query.year + 1}-01-01`),
        FilterOperators.LT,
        GroupOperator.AND,
      ),
      new Filter(
        'createdAt',
        new Date(`${query.year}-01-01`),
        FilterOperators.GT,
        GroupOperator.AND,
      ),
    ];
  }
}
