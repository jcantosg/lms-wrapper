import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { GetStudentsQuery } from '#student/application/get-students/get-students.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';

export class GetStudentsCriteria extends Criteria {
  constructor(query: GetStudentsQuery) {
    super(
      GetStudentsCriteria.createFilters(query),
      new Order(
        query.orderBy === 'businessUnit'
          ? 'academic_record_business_unit.name'
          : query.orderBy,
        query.orderType,
        query.orderBy === 'businessUnit',
      ),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: GetStudentsQuery): Filter[] {
    return [
      new Filter('name', query.name, FilterOperators.LIKE, GroupOperator.AND),
      new Filter(
        'surname',
        query.surname,
        FilterOperators.LIKE,
        GroupOperator.AND,
      ),
      new Filter(
        'identityDocument',
        query.identityDocumentNumber,
        FilterOperators.JSON_VALUE,
        GroupOperator.AND,
        undefined,
        'identityDocumentNumber',
      ),
      new Filter(
        'universaeEmail',
        query.universaeEmail,
        FilterOperators.LIKE,
        GroupOperator.AND,
      ),
      new Filter(
        'name',
        query.businessUnit,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'academic_record_business_unit',
      ),
      new Filter(
        'name',
        query.academicProgram,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'academic_record_academic_program',
      ),
      new Filter(
        'isDefense',
        query.isDefense,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
    ].filter((filter: Filter) => filter.value !== undefined);
  }
}
