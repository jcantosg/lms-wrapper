import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { GetSubjectQuery } from '#student-360/academic-offering/subject/application/get-subject/get-subject.query';

export class GetSubjectAcademicRecordCriteria extends Criteria {
  constructor(query: GetSubjectQuery) {
    super(GetSubjectAcademicRecordCriteria.createFilters(query));
  }

  static createFilters(query: GetSubjectQuery): Filter[] {
    return [
      new Filter(
        'student',
        query.student.id,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
      new Filter(
        'status',
        AcademicRecordStatusEnum.VALID,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
      new Filter(
        'id',
        query.subjectId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'academicProgramBlockSubjects',
      ),
    ];
  }
}
