import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { GetEnrollmentsByAcademicRecordQuery } from '#student/application/enrollment/get-enrollments-by-academic-record/get-enrollments-by-academic-record.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';

export class GetEnrollmentsByAcademicRecordCriteria extends Criteria {
  constructor(query: GetEnrollmentsByAcademicRecordQuery) {
    super(
      GetEnrollmentsByAcademicRecordCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
    );
  }

  static createFilters(query: GetEnrollmentsByAcademicRecordQuery) {
    return [
      new Filter(
        'id',
        query.academicRecordId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'academicRecord',
      ),
    ];
  }
}
