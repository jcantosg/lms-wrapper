import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { GetAcademicProgramsByTitleQuery } from '#academic-offering/applicaton/get-academic-programs-by-title/get-academic-programs-by-title.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';

export class GetAcademicProgramsByTitleCriteria extends Criteria {
  constructor(query: GetAcademicProgramsByTitleQuery) {
    super(
      GetAcademicProgramsByTitleCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(
    query: GetAcademicProgramsByTitleQuery,
  ): Filter[] {
    return [
      new Filter(
        'id',
        query.titleId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'title',
      ),
    ];
  }
}
