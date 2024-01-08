import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { Filter, FilterOperators } from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetAllBusinessUnitsQuery } from '#business-unit/application/get-all-business-units/get-all-business-units.query';

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
      new Filter('name', query.name, FilterOperators.LIKE),
      new Filter('code', query.code, FilterOperators.LIKE),
      new Filter('isActive', query.isActive),
      new Filter('country', query.country),
    ].filter((filter) => filter.value !== undefined);
  }
}
