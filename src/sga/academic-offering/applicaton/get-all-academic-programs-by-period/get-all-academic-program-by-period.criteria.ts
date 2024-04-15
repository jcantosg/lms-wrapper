import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetAllAcademicProgramsByPeriodQuery } from '#academic-offering/applicaton/get-all-academic-programs-by-period/get-all-academic-programs-by-period.query';

export class ListAcademicProgramByPeriodCriteria extends Criteria {
  constructor(query: GetAllAcademicProgramsByPeriodQuery) {
    super(
      ListAcademicProgramByPeriodCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(
    query: GetAllAcademicProgramsByPeriodQuery,
  ): Filter[] {
    return [
      new Filter(
        'id',
        query.academicPeriodId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'academicPeriods',
      ),
    ];
  }
}
