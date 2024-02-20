import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetAllBusinessUnitsQuery } from '#business-unit/application/business-unit/get-all-business-units/get-all-business-units.query';

export class GetAllBusinessUnitsCriteria extends Criteria {
  constructor(query: GetAllBusinessUnitsQuery) {
    super(
      GetAllBusinessUnitsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: GetAllBusinessUnitsQuery): Filter[] {
    return [
      new Filter('name', query.name, FilterOperators.LIKE, GroupOperator.AND),
      new Filter('code', query.code, FilterOperators.LIKE, GroupOperator.AND),
      new Filter(
        'isActive',
        query.isActive,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
      new Filter(
        'country',
        query.country,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
    ].filter((filter) => filter.value !== undefined);
  }
}
