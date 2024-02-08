import { Criteria, GroupOperator } from '#/sga/shared/domain/criteria/criteria';
import { Filter, FilterOperators } from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { SearchBusinessUnitsQuery } from '#business-unit/application/business-unit/search-business-units/search-business-units.query';

export class SearchBusinessUnitsCriteria extends Criteria {
  constructor(query: SearchBusinessUnitsQuery) {
    super(
      SearchBusinessUnitsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      GroupOperator.OR,
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: SearchBusinessUnitsQuery): Filter[] {
    return [
      new Filter('name', query.text, FilterOperators.LIKE),
      new Filter('code', query.text, FilterOperators.LIKE),
      new Filter('name', query.text, FilterOperators.LIKE, 'country'),
    ];
  }
}
