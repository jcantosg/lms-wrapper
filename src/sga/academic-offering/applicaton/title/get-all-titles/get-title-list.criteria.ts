import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetAllTitlesListQuery } from '#academic-offering/applicaton/title/get-all-titles/get-title-list.query';

export class GetAllTitlesCriteria extends Criteria {
  constructor(query: GetAllTitlesListQuery) {
    super(
      GetAllTitlesCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: GetAllTitlesListQuery): Filter[] {
    return [
      new Filter('name', query.name, FilterOperators.LIKE, GroupOperator.AND),
      new Filter(
        'officialCode',
        query.officialCode,
        FilterOperators.LIKE,
        GroupOperator.AND,
      ),
      new Filter(
        'officialTitle',
        query.officialTitle,
        FilterOperators.LIKE,
        GroupOperator.AND,
      ),
      new Filter(
        'officialProgram',
        query.officialProgram,
        FilterOperators.LIKE,
        GroupOperator.AND,
      ),
      new Filter(
        'name',
        query.businessUnit,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'business_unit',
      ),
    ].filter((filter) => filter.value !== undefined);
  }
}
