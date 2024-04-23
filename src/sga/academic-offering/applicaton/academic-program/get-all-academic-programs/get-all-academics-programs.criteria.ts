import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetAllAcademicProgramsQuery } from '#academic-offering/applicaton/academic-program/get-all-academic-programs/get-all-academic-programs.query';

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
        'id',
        query.businessUnit,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'business_unit',
      ),
      new Filter(
        'structureType',
        query.structureType,
        FilterOperators.LIKE,
        GroupOperator.AND,
      ),
      new Filter(
        'academic_program_id',
        query.programBlocksNumber,
        FilterOperators.COUNT,
        GroupOperator.AND,
        'programBlocks',
        'program_blocks',
      ),
    ].filter((filter: Filter) => filter.value !== undefined);
  }
}
