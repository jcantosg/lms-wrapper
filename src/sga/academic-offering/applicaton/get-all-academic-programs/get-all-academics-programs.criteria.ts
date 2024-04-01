import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { GetAllAcademicProgramsQuery } from '#academic-offering/applicaton/get-all-academic-programs/get-all-academic-programs.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';

export class GetAllAcademicsProgramsCriteria extends Criteria {
  constructor(query: GetAllAcademicProgramsQuery) {
    super(
      GetAllAcademicsProgramsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: GetAllAcademicProgramsQuery): Filter[] {
    return [
      new Filter('name', query.name, FilterOperators.LIKE, GroupOperator.AND),
      new Filter(
        'name',
        query.title,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'title',
      ),
      new Filter('code', query.code, FilterOperators.LIKE, GroupOperator.AND),
      new Filter(
        'code',
        query.titleOfficialCode,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'title',
      ),
      new Filter(
        'id',
        query.businessUnit,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'business_unit',
      ),
    ].filter((filter: Filter) => filter.value !== undefined);
  }
}
