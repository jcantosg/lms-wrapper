import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { GetStudentAcademicRecordsQuery } from '#/student/academic-offering/academic-record/application/get-student-academic-records/get-student-academic-records.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';

export class GetStudentAcademicRecordsCriteria extends Criteria {
  constructor(query: GetStudentAcademicRecordsQuery) {
    super(GetStudentAcademicRecordsCriteria.createFilters(query));
  }

  static createFilters(query: GetStudentAcademicRecordsQuery): Filter[] {
    return [
      new Filter(
        'student',
        query.studentId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
      new Filter(
        'status',
        AcademicRecordStatusEnum.VALID,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
    ];
  }
}
