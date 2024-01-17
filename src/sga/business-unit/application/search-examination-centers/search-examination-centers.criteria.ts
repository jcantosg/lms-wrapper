import { Criteria, GroupOperator } from '#/sga/shared/domain/criteria/criteria';
import { Filter, FilterOperators } from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { SearchExaminationCentersQuery } from '#business-unit/application/search-examination-centers/search-examination-centers.query';

export class SearchExaminationCentersCriteria extends Criteria {
  constructor(query: SearchExaminationCentersQuery) {
    super(
      SearchExaminationCentersCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      GroupOperator.OR,
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: SearchExaminationCentersQuery): Filter[] {
    return [
      new Filter('name', query.text, FilterOperators.LIKE),
      new Filter('code', query.text, FilterOperators.LIKE),
      new Filter('name', query.text, FilterOperators.LIKE, 'country'),
    ];
  }
}
