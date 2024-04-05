import { GetAllAcademicProgramsPlainQuery } from '#academic-offering/applicaton/get-all-academic-programs-plain/get-all-academic-programs-plain.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { Order, OrderTypes } from '#/sga/shared/domain/criteria/order';

export class GetAllAcademicProgramsPlainCriteria extends Criteria {
  constructor(query: GetAllAcademicProgramsPlainQuery) {
    super(
      GetAllAcademicProgramsPlainCriteria.createFilters(query),
      new Order('id', OrderTypes.NONE),
      1,
      200,
    );
  }

  private static createFilters(
    query: GetAllAcademicProgramsPlainQuery,
  ): Filter[] {
    return [
      new Filter(
        'id',
        query.businessUnitId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'business_unit',
      ),
    ];
  }
}
